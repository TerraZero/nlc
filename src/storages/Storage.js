const Bag = require('nlc/src/sys/Bag');

module.exports = class Storage extends Bag {

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
