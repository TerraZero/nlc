const NLC = require('../../index');

module.exports = class Storage extends NLC.sys.Bag {

  constructor(context) {
    super();
    this._context = context;
  }

  create(data = {}) {
    this._data = data;
    return this;
  }

  get context() {
    return this._context;
  }

}
