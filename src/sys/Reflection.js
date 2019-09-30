module.exports = class Reflection {

  /**
   * @param {function} func
   * @returns {string}
   */
  static getFunctionDescription(func) {
    return func.name + '(' + this.getFunctionArgs(func).join(', ') + ')';
  }

  /**
   * @param {function} func
   * @returns {string[]}
   */
  static getFunctionArgs(func) {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

    return (result === null ? [] : result);
  }

  /**
   * @param {Object} data
   * @param {string} name
   * @param {any} fallback
   * @returns {any}
   */
  static getDeep(data, name, fallback = null) {
    const splits = name.split('.');

    for (const split of splits) {
      if (data === undefined) return fallback;
      data = data[split];
    }
    return (data === undefined ? fallback : data);
  }

  /**
   * @param {Object} data
   * @param {string} name
   * @param {any} value
   */
  static setDeep(data, name, value) {
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    data[last] = value;
  }

  /**
   * @param {Object} data
   * @param {string} name
   */
  static removeDeep(data, name) {
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    delete data[last];
  }

  /**
   * @param {Object} data
   * @param {string} name
   */
  static removeDeepRecursive(data, name) {
    const original = data;
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    delete data[last];

    if (Object.keys(data).length === 0 && splits.length) {
      this.removeDeepRecursive(original, splits.join('.'));
    }
  }

  /**
   * @param {Object} data
   * @param {string} name
   * @param {any} value
   * @returns {any}
   */
  static search(data, name, value) {
    for (const index in data) {
      if (data[index][name] === value) {
        return data[index];
      }
    }
    return null;
  }

  /**
   * @param {string} message
   * @param {(Array|Object)} placeholders
   * @param {string|import('../../defs').Inserter} inserter
   * @returns {string}
   */
  static replaceMessage(message, placeholders, inserter = '"') {
    if (Array.isArray(placeholders)) {
      return this.replaceArray(message, placeholders, inserter);
    } else {
      return this.replaceObject(message, placeholders, inserter);
    }
  }

  /**
   * @param {string} message
   * @param {Array} placeholders
   * @param {string|import('../../defs').Inserter} inserter
   * @returns {string}
   */
  static replaceArray(message, placeholders = [], inserter = '"') {
    let doInserter = inserter;

    if (typeof doInserter !== 'function') {
      doInserter = (v) => {
        if (typeof inserter === 'string') {
          return inserter + v + inserter;
        }
        return v;
      };
    }

    for (const index in placeholders) {
      message = message.replace(new RegExp('\\[' + index + '\\]', 'g'), doInserter(placeholders[index]));
    }
    return message;
  }

  /**
   * @param {string} message
   * @param {Object} placeholders
   * @param {string|import('../../defs').Inserter} inserter
   * @returns {string}
   */
  static replaceObject(message, placeholders = {}, inserter = '"') {
    let doInserter = inserter;

    if (typeof doInserter !== 'function') {
      doInserter = (v) => {
        if (typeof inserter === 'string') {
          return inserter + v + inserter;
        }
        return v;
      };
    }

    for (const placeholder in placeholders) {
      message = message.replace(new RegExp(placeholder, 'g'), doInserter(placeholders[placeholder]));
    }
    return message;
  }

}
