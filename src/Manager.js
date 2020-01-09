const Path = require('path');
const Glob = require('glob');
const OS = require('os');
const Commander = require('commander');
const EventEmitter = require('events');

const Request = require('nlc/src/Request');
const Command = require('nlc/src/Command');

const ConfigManager = require('nlc/src/sys/ConfigManager');
const Launcher = require('nlc/src/sys/Launcher');
const Event = require('nlc/src/sys/Event');

const ServiceFactory = require('nlc/src/factories/ServiceFactory');
const Logger = require('nlc/src/loggers/Logger.service');
const ManagerError = require('nlc/src/errors/ManagerError');

module.exports = class Manager {

  constructor() {
    this._commands = {};
    this._services = new ServiceFactory(this);
    this._logger = null;
    this._events = new EventEmitter();
    this._requests = [];
    this._booted = false;
    this._bootCommands = false;
    this._config = new ConfigManager(this);

    this._launcher = new Launcher('nlc');
    this._launcher.boot('nlc:script', Path.join(__dirname, '..'));
    this._launcher.boot('nlc:home', OS.homedir(), false);
    this._launcher.boot('nlc:cwd', process.cwd());
  }

  /**
   * @returns {Launcher}
   */
  get launcher() {
    return this._launcher;
  }

  /**
   * @returns {Object<string, import('nlc/defs').CommandDefinition>}
   */
  get commands() {
    return this._commands;
  }

  /**
   * @returns {Commander}
   */
  get program() {
    return Commander;
  }

  /**
   * @returns {import('nlc/src/loggers/Logger.service')}
   */
  get logger() {
    if (this._logger === null) {
      this._logger = this.service('nlc.logger');
    }
    return this._logger;
  }

  /**
   * @returns {EventEmitter}
   */
  get event() {
    return this._events;
  }

  /**
   * @returns {ServiceFactory}
   */
  get services() {
    return this._services;
  }

  /**
   * @returns {Request}
   */
  get request() {
    return this._requests[this._requests.length - 1];
  }

  /**
   * @returns {ConfigManager}
   */
  get config() {
    return this._config;
  }

  /**
   * @param {string} name
   * @returns {Object}
   */
  service(name) {
    return this.services.get(name);
  }

  /**
   * @param {string} event
   * @param {...any} args
   * @returns {Promise}
   */
  trigger(event, ...args) {
    const e = new Event(event, this, args);
    this.event.emit(event, e);
    return e.promise;
  }

  /**
   * @param {string} event
   * @param {import('nlc/defs').eventListener} listener
   * @returns {this}
   */
  on(event, listener) {
    this.event.on(event, listener);
    return this;
  }

  boot() {
    if (this._booted) return;
    this._booted = true;

    for (const path in this.launcher.loaded) {
      const config = this.launcher.loaded[path].config;

      this.bootingEvents(config.get('events'), path);
      this.config.addConfig(path, this.launcher.loaded[path]);
    }

    this.trigger(Event.ON_CONFIG, this.config);

    this.bootingServices(this.config.all('services'), this.config.all('path'));

    this.trigger(Event.ON_BOOT);
  }

  bootCommands() {
    if (this._bootCommands) return;
    this._bootCommands = true;

    this.bootingCommands(this.config.all('commands'), this.config.all('path'));
    this.init();
  }

  /**
   * @param {Object[]} config
   * @param {string[]} path
   */
  bootingCommands(config, path) {
    for (const index in config) {
      if (!config[index]) continue;

      // ensure commands array
      if (!Array.isArray(config[index])) {
        config[index] = [config[index]];
      }

      for (const pattern of config[index]) {
        const files = Glob.sync(pattern, {
          cwd: path[index],
          absolute: true,
        });

        for (const file of files) {
          this._loadCommand(path[index], pattern, Path.normalize(file));
        }
      }
    }
  }

  /**
   * @param {(Object|Array)} config
   * @param {string} path
   */
  bootingEvents(config, path) {
    if (!config) return;

    // ensure commands array
    if (!Array.isArray(config)) {
      config = [config];
    }

    for (const define of config) {
      if (define.function === undefined) define.function = 'register';
      const files = Glob.sync(define.pattern, {
        cwd: path,
        absolute: true,
      });

      for (const file of files) {
        require(file)[define.function](this);
      }
    }
  }

  /**
   * @param {Object[]} config
   * @param {string[]} path
   */
  bootingServices(config, path) {
    for (const index in config) {
      if (!config[index]) continue;

      if (!Array.isArray(config[index])) {
        config[index] = [config[index]];
      }

      for (const pattern of config[index]) {
        const files = Glob.sync(pattern, {
          cwd: path[index],
          absolute: true,
        });

        for (const file of files) {
          const service = require(file).service;

          service.file = file;
          this.services.set(service.name, service);
        }
      }
    }
  }

  init() {
    for (const name in this.commands) {
      this.commands[name].command.doInit()
        .action(async (...args) => {
          this._requests.push(new Request(args, this._requests.length && this._requests[this._requests.length - 1] || null));
          const back = await this.commands[name].command.doAction();
          this._requests.pop();

          // fix for windows
          if (this._requests.length === 0) {
            await this.trigger(Event.ON_EXIT);
            process.exit(0);
          }
          return back;
        });
    }

    this.program.option('-v, --verbose [option]', 'be verbose', true);
    this.program.option('--debug', 'debug');
    this.program.option('-q, --quite', 'be quite');

    // error on unknown commands
    this.program.on('command:*', () => {
      console.error('Invalid command: %s\nSee --help for a list of available commands.', this.program.args.join(' '));
      process.exit(1);
    });

    this.program.on('option:verbose', (verbose) => {
      if (verbose === null) verbose = true;
      this.logger.setVerbose(verbose, true);
    });
    this.program.on('option:debug', () => {
      this.logger.setVerbose(Logger.VERBOSE_ALL, true);
    });
    this.program.on('option:quite', () => {
      this.logger.setVerbose(Logger.VERBOSE_QUITE, true);
    });
  }

  /**
   * @param {(Array|string)} argv
   */
  async execute(argv = []) {
    if (typeof argv === 'string') {
      argv = argv.split(' ');
      argv.unshift('');
      argv.unshift('');
    }

    this.bootCommands();
    await this.trigger(Event.ON_EXECUTE, argv);
    await this.program.parse(argv);
  }

  _loadCommand(path, pattern, file) {
    if (this.commands[file] !== undefined) return;

    const subject = require(file);
    const command = new subject(this);

    if (command instanceof Command) {
      this._commands[file] = {
        path,
        file,
        name: subject.name,
        pattern,
        command,
      };
    } else {
      throw new ManagerError(1, 'The file path is not a NLC.Command from nlc package.', { path: file });
    }
  }

}
