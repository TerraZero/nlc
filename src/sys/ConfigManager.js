const Bag = require('nlc/src/sys/Bag');
const BagCollection = require('nlc/src/sys/BagCollection');

module.exports = class ConfigManager {

  constructor(manager) {
    this._manager = manager;
    this._data = new BagCollection();
  }

  /**
   * @returns {BagCollection}
   */
  get data() {
    return this._data;
  }

  /**
   * @param {string} path
   * @param {import('nlc/defs').LauncherDefinition} definition
   * @returns {this}
   */
  addConfig(path, definition) {
    const bag = new Bag(JSON.parse(JSON.stringify(definition.config.data)));

    bag.set('path', path);
    this.data.addBag(definition.name, bag);
    return this;
  }

  /**
   * @param {string} key
   * @param {any} fallback
   * @returns {any[]}
   */
  all(key, fallback = undefined) {
    return this.data.all(key, fallback);
  }

  /**
   * @param {string} name
   * @param {string} key
   * @param {any} fallback
   * @returns {any}
   */
  get(name, key, fallback = null) {
    return this.data.bags.get(name).get(key, fallback);
  }

}
