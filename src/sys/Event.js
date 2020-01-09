module.exports = class Event {

  static get ON_BOOT() { return 'nlc:boot'; }
  static get ON_EXIT() { return 'nlc:exit'; }
  static get ON_EXECUTE() { return 'nlc:execute'; }
  static get ON_CONFIG() { return 'nlc:config'; }

  /**
   * @param {string} event
   * @param {import('nlc/src/Manager')} manager
   * @param {Array} args
   */
  constructor(event, manager, args) {
    this._event = event;
    this._manager = manager;
    this._args = args;
    this._thens = [];
  }

  /**
   * @returns {string}
   */
  get event() {
    return this._event;
  }

  /**
   * @returns {import('nlc/src/Manager')}
   */
  get manager() {
    return this._manager;
  }

  /**
   * @returns {Array}
   */
  get args() {
    return this._args;
  }

  /**
   * @returns {Promise}
   */
  get promise() {
    return Promise.all(this._thens);
  }

  /**
   * @param {PromiseLike} promise
   * @returns {this}
   */
  then(promise) {
    this._thens.push(promise);
    return this;
  }

}
