const CommandError = require('nlc/src/errors/CommandError');

module.exports = class Command {

  constructor(manager) {
    this._manager = manager;
    this._definition = null;
  }

  /**
   * @returns {import('nlc/src/Manager')}
   */
  get manager() {
    return this._manager;
  }

  /**
   * @returns {import('nlc/src/loggers/Logger.service')}
   */
  get logger() {
    return this.manager.logger;
  }

  /**
   * @returns {import('nlc/src/Request')}
   */
  get request() {
    return this.manager.request;
  }

  /**
   * @returns {boolean}
   */
  isInited() {
    return this._definition !== null;
  }

  /**
   * @param {string} definition
   * @returns {import('commander')}
   */
  command(definition) {
    return this.manager.program.command(definition);
  }

  /**
   * @param {import('nlc/src/loggers/Logger.service')} logger
   * @returns {this}
   */
  setLogger(logger) {
    if (!this.isInited()) {
      throw new CommandError(2, 'Logger can only be set in action method.');
    }
    this.manager.setLogger(logger);
    return this;
  }

  doInit() {
    if (this._definition !== null) return this._definition;
    this._definition = this.init();
    return this._definition;
  }

  init() { }

  /**
   * @returns {any}
   */
  doAction() {
    return this.action();
  }

  action() { }

}
