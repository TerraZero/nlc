const NLC = require('../../index');

module.exports = class Logger {

  static get VERBOSE_QUITE() { return 0; }
  static get VERBOSE_DEBUG() { return 1; }
  static get VERBOSE_ERROR() { return 2; }
  static get VERBOSE_WARN() { return 4; }
  static get VERBOSE_LOG() { return 8; }
  static get VERBOSE_ALL() { return 15; }

  static get service() {
    return {
      name: 'nlc.logger',
    };
  }

  static create(manager) {
    return new this(manager);
  }

  /**
   * @param {NLC.Manager} manager
   */
  constructor(manager) {
    this._manager = manager;
    this._verbosity = Logger.VERBOSE_LOG | Logger.VERBOSE_ERROR;
    this._lock = false;
    this._parent = null;
    this._bubbling = true;
  }

  /**
   * @returns {number}
   */
  get verbosity() {
    return this._verbosity;
  }

  /**
   * @returns {this}
   */
  stopBubbling() {
    this._bubbling = false;
    return this;
  }

  /**
   * @param {(boolean|number)} option
   * @param {boolean} lock
   * @param {NLC.loggers.Logger} parent
   * @returns {this}
   */
  setVerbose(option, lock = false, parent = false) {
    if (parent && this._parent !== null) this._parent.setVerbose(option, lock);
    if (this._lock && !lock) return;
    this._lock = lock;

    if (option === true) {
      this._verbosity = Logger.VERBOSE_ALL;
      return this;
    } else if (option === false) {
      this._verbosity = Logger.VERBOSE_QUITE;
      return this;
    }

    if (Number.isInteger(option)) {
      this._verbosity = option;
      return this;
    }

    switch (option) {
      case 'all':
        this._verbosity = Logger.VERBOSE_ALL;
        break;
      case 'debug':
        this._verbosity |= Logger.VERBOSE_DEBUG;
        break;
      case 'error':
        this._verbosity |= Logger.VERBOSE_ERROR;
        break;
      case 'warn':
        this._verbosity |= Logger.VERBOSE_WARN;
        break;
      case 'log':
        this._verbosity |= Logger.VERBOSE_LOG;
        break;
      case 'quite':
        this._verbosity = Logger.VERBOSE_QUITE;
        break;
    }
    return this;
  }

  /**
   * @param {NLC.loggers.Logger} parent
   */
  setParent(parent) {
    if (parent instanceof Logger) {
      this._parent = parent;
    } else {
      throw new NLC.errors.CommandError('Logger parent is not a Logger from nlc package.', { parent: parent.name });
    }
  }

  /**
   * @param {number} pos
   * @returns {boolean}
   */
  isVerbose(pos) {
    return (this._verbosity & pos) === pos;
  }

  /**
   * @returns {boolean}
   */
  isBubbling() {
    return this._parent !== null && this._bubbling;
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  log(message = '', placeholders = {}, inserter = '"') {
    if (this.isVerbose(Logger.VERBOSE_LOG)) {
      this.doLog(message, placeholders, inserter);
      this._manager.trigger('nlc:logger:log', this, { message, placeholders, inserter });
    }
    if (this.isBubbling()) this._parent.log(message, placeholders, inserter);
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  doLog(message = '', placeholders = {}, inserter = '"') {
    console.log(NLC.sys.Reflection.replaceObject(message, placeholders, inserter));
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  warn(message = '', placeholders = {}, inserter = '"') {
    if (this.isVerbose(Logger.VERBOSE_WARN)) {
      this.doWarn(message, placeholders, inserter);
      this._manager.trigger('nlc:logger:warn', this, { message, placeholders, inserter });
    }
    if (this.isBubbling()) this._parent.warn(message, placeholders, inserter);
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  doWarn(message = '', placeholders = {}, inserter = '"') {
    console.warn(NLC.sys.Reflection.replaceObject(message, placeholders, inserter));
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  error(message = '', placeholders = {}, inserter = '"') {
    if (this.isVerbose(Logger.VERBOSE_ERROR)) {
      this.doError(message, placeholders, inserter);
      this._manager.trigger('nlc:logger:error', this, { message, placeholders, inserter });
    }
    if (this.isBubbling()) this._parent.error(message, placeholders, inserter);
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  doError(message = '', placeholders = {}, inserter = '"') {
    console.error(NLC.sys.Reflection.replaceObject(message, placeholders, inserter));
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  debug(message = '', placeholders = {}, inserter = '"') {
    if (this.isVerbose(Logger.VERBOSE_DEBUG)) {
      this.doDebug(message, placeholders, inserter);
      this._manager.trigger('nlc:logger:debug', this, { message, placeholders, inserter });
    }
    if (this.isBubbling()) this._parent.debug(message, placeholders, inserter);
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  doDebug(message = '', placeholders = {}, inserter = '"') {
    console.log(NLC.sys.Reflection.replaceObject(message, placeholders, inserter));
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  success(message = '', placeholders = {}, inserter = '"') {
    if (this.isVerbose(Logger.VERBOSE_LOG)) {
      this.doSuccess(message, placeholders, inserter);
      this._manager.trigger('nlc:logger:success', this, { message, placeholders, inserter });
    }
    if (this.isBubbling()) this._parent.success(message, placeholders, inserter);
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  doSuccess(message = '', placeholders = {}, inserter = '"') {
    console.log('[SUCCESS]:', NLC.sys.Reflection.replaceObject(message, placeholders, inserter));
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  failed(message = '', placeholders = {}, inserter = '"') {
    if (this.isVerbose(Logger.VERBOSE_LOG)) {
      this.doFailed(message, placeholders, inserter);
      this._manager.trigger('nlc:logger:failed', this, { message, placeholders, inserter });
    }
    if (this.isBubbling()) this._parent.failed(message, placeholders, inserter);
  }

  /**
   * @param {string} message
   * @param {Object<string, string>} placeholders
   * @param {(string|import('../../defs').Inserter)} inserter
   */
  doFailed(message = '', placeholders = {}, inserter = '"') {
    console.log('[FAILED]:', NLC.sys.Reflection.replaceObject(message, placeholders, inserter));
  }

}
