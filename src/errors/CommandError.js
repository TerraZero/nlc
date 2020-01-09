const Error = require('nlc/src/errors/Error');

module.exports = class CommandError extends Error {

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
