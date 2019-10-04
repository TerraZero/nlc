const NLC = require('../../index');

module.exports = class ConfigManager {

  constructor(manager) {
    this._manager = manager;
    this._data = new NLC.sys.BagCollection();
  }

  /**
   * @returns {NLC.sys.BagCollection}
   */
  get data() {
    return this._data;
  }

  /**
   * @param {string} path
   * @param {import('../../defs').LauncherDefinition} definition
   * @returns {this}
   */
  addConfig(path, definition) {
    const bag = new NLC.sys.Bag(JSON.parse(JSON.stringify(definition.config.data)));

    bag.set('path', path);
    this.data.addBag(definition.name, bag);
    return this;
  }

  /**
   * @param {string} key
   * @param {any} fallback
   * @returns {any[]}
   */
  all(key, fallback = null) {
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
