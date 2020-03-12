import OS from 'os';

import LoggerBuilder from 'nlc-util/src/logger/LoggerBuilder';
import BagCollection from 'nlc-util/src/data/BagCollection';
import Bag from 'nlc-util/src/data/Bag';
import Finder from 'nlc-util/src/loader/Finder';
import Injection from 'nlc-util/src/loader/Injection';



export default class Core {

  constructor(master_require = null) {
    this._require = master_require || require;
    this._config = new BagCollection();
    this._container = new Injection();
    this._finder = new Finder(this._require);
    this._extensions = new BagCollection();

    this._logger = null;
    this._corelog = null;
  }

  get config() {
    return this._config;
  }

  get logger() {
    return this._logger;
  }

  get extensions() {
    return this._extensions;
  }

  get container() {
    return this._container;
  }

  createLogger(context, level = null) {
    return this.logger.logger(context, level);
  }

  isCli() {
    return this._cli;
  }

  boot(cwd = null, cli = false) {
    cwd = cwd || process.cwd();
    this._cli = cli;

    this.loadConfig('cwd', cwd);
    this.loadConfig('home', OS.homedir());
    this.loadConfig('nlc', module);

    this._logger = new LoggerBuilder();

    this.logger.install(this.config.get('nlc.logger'), this._cli);
    this._corelog = this.logger.logger('core');

    const bootlog = this._corelog.create('boot');

    bootlog.trace('Start booting...');

    bootlog.trace('Register extensions...');
    this._finder.register(this._extensions, cwd, bootlog);
    this._finder.register(this._extensions, OS.homedir(), bootlog);
    this._finder.register(this._extensions, this._finder.getInfo(module).value.name, bootlog);

    bootlog.trace('Register default services...');
    this.container.set('nlc.core', this);
    this.container.set('nlc.require', this._require);
    this.container.set('nlc.logger', this.logger);

    bootlog.trace('Register dynamic services...');
    for (const [, bag] of this.extensions.bags) {
      this.container.loader.load(bag.get('_path'));
    }

    this.container.init();

    this.container.trigger('on.core.boot', this, this.container);
    this.preCompile();
    this.container.container.compile();
    this.container.trigger('on.core.init', this, this.container);

    bootlog.trace('Finished booting');
  }

  loadConfig(name, context) {
    const root = this._finder.getInfo(context);

    if (root) {
      const nlc = this._finder.getNLC(root.value.name);
      if (nlc !== null) root.nlc = nlc;
      this.config.addBag(name, new Bag(root));
    }
  }

  /**
   * @param {string} name
   * @returns {any}
   */
  service(name) {
    return this.container.get(name);
  }

  preCompile() {
    for (const [, definition] of this.container.container.definitions) {
      if (definition.tags.indexOf('lazy') !== false) {
        definition.lazy = true;
      }
    }
  }

}
