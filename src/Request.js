const NLC = require('../index');

module.exports = class Request {

  /**
   * @param {Array} args
   * @param {NLC.Request} parent
   */
  constructor(args, parent = null) {
    this._args = args;
    this._program = null;
    this._options = {};
    this._bag = new NLC.sys.Bag();
    this._parent = parent;

    if (args[args.length - 1] instanceof NLC.Commander.Command) {
      this._program = args.pop();
    }

    for (const opt of this._program.options) {
      let name = opt.long;

      if (name.startsWith('--')) {
        name = name.substring(2);
      } else {
        name = name.substring(1).toUpperCase();
      }
      this._options[name] = this._program[name];
    }
  }

  /**
   * @returns {Object<string, (boolean|number|string|Array)>}
   */
  get options() {
    return this._options;
  }

  /**
   * @returns {string[]}
   */
  get args() {
    return this._args;
  }

  /**
   * @returns {NLC.Commander.Command}
   */
  get program() {
    return this._program;
  }

  /**
   * @returns {NLC.Request}
   */
  get parent() {
    return this._parent;
  }

  /**
   * @returns {NLC.Request}
   */
  get root() {
    let request = this;

    while (request.parent !== null) {
      request = request.parent;
    }
    return request;
  }

  /**
   * @returns {NLC.sys.Bag}
   */
  get bag() {
    return this._bag;
  }

  /**
   * @param {string} name
   * @param {any} fallback
   * @returns {any}
   */
  get(name, fallback = null) {
    return this.bag.get(name, fallback);
  }

  /**
   * @param {string} name
   * @param {any} value
   * @returns {this}
   */
  set(name, value) {
    this.bag.set(name, value);
    return this;
  }

}
