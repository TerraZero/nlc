const NLC = require('../../index');

module.exports = class CommandError extends NLC.errors.Error {

  constructor(code, message, placeholders = {}, inserter = '"') {
    if (!Array.isArray(placeholders)) {
      placeholders.code = code;
    }
    super(message, placeholders, inserter);
    this._code = code;
  }

  getCode() {
    return this._code;
  }

}
