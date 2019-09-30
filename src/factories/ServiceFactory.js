const NLC = require('../../index');

module.exports = class ServiceFactory extends NLC.factories.Factory {

  doGet(key, definition) {
    const Struct = require(definition.file);
    const args = [this.manager];

    if (definition.dependencies) {
      for (const dependent of definition.dependencies) {
        args.push(this.get(dependent));
      }
    }

    return Struct.create(...args);
  }

  /**
   *
   * @param {string} tag
   * @returns {Object<string, Object>}
   */
  getTagged(tag) {
    const services = {};

    for (const key in this.register) {
      if (Array.isArray(this.register[key].tags) && this.register[key].tags.includes(tag)) {
        services[key] = this.get(key);
      }
    }
    return services;
  }

}
