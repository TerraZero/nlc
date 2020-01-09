const Reflection = require('nlc/src/sys/Reflection');

module.exports = class Bag {

  constructor(data = {}) {
    this._data = data;
    this._editable = true;
  }

  /**
   * @returns {Object}
   */
  get data() {
    return this._data;
  }

  /**
   * @returns {boolean}
   */
  get editable() {
    return this._editable;
  }

  /**
   * @param {boolean} editable
   * @returns {this}
   */
  setEditable(editable = false) {
    this._editable = editable;
    return this;
  }

  /**
   * @param {string} name
   * @param {any} fallback
   * @returns {any}
   */
  get(name, fallback = null) {
    return Reflection.getDeep(this.data, name, fallback);
  }

  /**
   * @param {string} name
   * @param {any} value
   * @returns {this}
   */
  set(name, value) {
    if (this.editable) {
      Reflection.setDeep(this.data, name, value);
    }
    return this;
  }

  /**
   * @param {string} name
   * @returns {this}
   */
  remove(name) {
    if (this.editable) {
      Reflection.removeDeepRecursive(this.data, name);
    }
    return this;
  }

  /**
   * @returns {this}
   */
  clear() {
    if (this.editable) {
      this._data = {};
    }
    return this;
  }

}
