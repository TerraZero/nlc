const NLC = require('../../index');

module.exports = class BagCollection {

  /**
   * @param {string} default_bag
   */
  constructor(default_bag = null) {
    this._bags = new Map();
    this._default = default_bag;
  }

  /**
   * @returns {Map<string, NLC.sys.Bag>}
   */
  get bags() {
    return this._bags;
  }

  /**
   * @returns {string}
   */
  get defaultBag() {
    if (this._default === null) {
      return (this.bags.size ? this.bags.keys()[0] : null);
    }
    return this._default;
  }

  /**
   * @param {string} name
   * @param {NLC.sys.Bag} bag
   * @returns {this}
   */
  addBag(name, bag) {
    this.bags.set(name, bag);
    return this;
  }

  /**
   * @param {string} name
   * @returns {this}
   */
  setDefault(name) {
    this._default = name;
    return this;
  }

  /**
   * @param {string} name
   * @param {any} fallback
   * @returns {any}
   */
  get(name, fallback = null) {
    for (const [key, bag] of this.bags) {
      const value = bag.get(name, null);

      if (value !== null) return value;
    }
    return fallback;
  }

  /**
   * @param {string} name
   * @param {any} value
   * @returns {this}
   */
  set(name, value) {
    this.bags.get(this.defaultBag).set(name, value);
    return this;
  }

  /**
   * @param {string} name
   * @returns {this}
   */
  remove(name) {
    this.bags.get(this.defaultBag).remove(name);
    return this;
  }

}
