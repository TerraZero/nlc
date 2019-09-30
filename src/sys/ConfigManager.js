const NLC = require('../../index');

module.exports = class ConfigManager {

  constructor(manager) {
    this._manager = manager;
    this._data = new NLC.sys.Bag();
    this._roots = [];
  }

  /**
   * @returns {NLC.sys.Bag}
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
    this._roots.push(definition.name);
    this.data.set(definition.name, JSON.parse(JSON.stringify(definition.config.data)));
    this.data.set(definition.name + '.path', path);
    return this;
  }

  /**
   * @param {string} key
   * @param {any} fallback
   * @returns {any[]}
   */
  all(key, fallback = null) {
    const values = [];

    for (const root of this._roots) {
      values.push(this.get(root, key, fallback));
    }
    return values;
  }

  /**
   * @param {string} name
   * @param {string} key
   * @param {any} fallback
   * @returns {any}
   */
  get(name, key, fallback = null) {
    return this.data.get(name + '.' + key, fallback);
  }

}
