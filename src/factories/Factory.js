module.exports = class Factory {

  /**
   * @typedef {Object} LoaderDefinition
   * @property {Object} object
   */

  constructor(manager) {
    this._register = {};
    this._manager = manager;
  }

  /**
   * @returns {import('../../index').Manager}
   */
  get manager() {
    return this._manager;
  }

  /**
   * @returns {Object<string, LoaderDefinition>}
   */
  get register() {
    return this._register;
  }

  /**
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    if (!this.register[key].object) {
      this.register[key].object = this.doGet(key, this.register[key]);
    }
    return this.register[key].object;
  }

  /**
   * @param {string} key
   * @param {Object} definition
   */
  doGet(key, definition) { }

  /**
   * @param {string} key
   * @param {Object} definition
   * @returns {this}
   */
  set(key, definition) {
    this.register[key] = definition;
    return this;
  }

}
