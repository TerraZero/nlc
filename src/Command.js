const NLC = require('../index');

module.exports = class Command {

  constructor(manager) {
    this._manager = manager;
    this._definition = null;
  }

  /**
   * @returns {NLC.Manager}
   */
  get manager() {
    return this._manager;
  }

  /**
   * @returns {NLC.loggers.Logger}
   */
  get logger() {
    return this.manager.logger;
  }

  /**
   * @returns {NLC.Request}
   */
  get request() {
    return this.manager.request;
  }

  isInited() {
    return this._definition !== null;
  }

  /**
   * @param {string} definition
   * @returns {NLC.Commander}
   */
  command(definition) {
    return this.manager.program.command(definition);
  }

  setLogger(logger) {
    if (!this.isInited()) {
      throw new NLC.errors.NLCCommandError(2, 'Logger can only be set in action method.');
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
