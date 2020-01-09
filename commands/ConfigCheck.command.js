const JSONSchema = require('jsonschema');

const Command = require('nlc/src/Command');

module.exports = class ConfigCheckCommand extends Command {

  init() {
    return this.command('config:check');
  }

  action() {
    this.request.set('error', 0);
    for (const definition of this.manager.launcher.getFiles('nlc.validate.json')) {
      this.logger.debug('Load validate schema from :pack', { ':pack': definition.index });
      const validate = require(definition.file);

      this.checkSchema(validate);
    }
    console.log();
    if (this.request.get('error') === 0) {
      this.logger.success('No config errors found.');
    } else {
      this.logger.failed(':errors error/s found in loaded configs.', { ':errors': this.request.get('error') });
    }
  }

  checkSchema(validate) {
    const validator = new JSONSchema.Validator();

    if (!Array.isArray(validate)) validate = [validate];

    for (const { mount, schema } of validate) {
      const configs = this.manager.config.all(mount);
      const paths = this.manager.config.all('path');

      for (const index in configs) {
        this.logger.debug('Check package :pack with mount :mount', { ':pack': paths[index], ':mount': mount });
        if (configs[index] === null) continue;
        const result = validator.validate(configs[index], schema);

        if (result.errors.length !== 0) {
          this.request.set('error', this.request.get('error') + result.errors.length);

          this.logger.error('Package :pack has a config structure error on mount point :mount', { ':pack': paths[index], ':mount': mount });
          for (const error of result.errors) {
            const property = error.property.replace('instance', mount);
            const subschemas = this.getSubSchemas(error);

            let message = error.message;
            for (const argindex in error.argument) {
              const arg = error.argument[argindex];

              if (arg.startsWith('[') && arg.endsWith(']')) {
                message = message.replace(arg, subschemas[argindex].type);
              }
            }

            this.logger.log('\t' + property + ' ' + message.replace(',', ' or '));
          }
        }
      }
    }
  }

  /**
   *
   * @param {JSONSchema.ValidationError} error
   */
  getSubSchemas(error) {
    if (Array.isArray(error.schema[error.name])) {
      return error.schema[error.name];
    } else {
      return [error.schema];
    }
  }

}
