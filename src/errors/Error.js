const NLC = require('../../index');
const E = Error;

module.exports = class Error extends E {

  constructor(message, placeholders, inserter = '"') {
    super(NLC.sys.Reflection.replaceMessage(message, placeholders, inserter));
  }

}
