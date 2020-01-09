const PrivateError = Error;

const Reflection = require('nlc/src/sys/Reflection');

module.exports = class Error extends PrivateError {

  constructor(message, placeholders, inserter = '"') {
    super(Reflection.replaceMessage(message, placeholders, inserter));
  }

}
