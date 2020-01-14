const Finder = require('find-package-json');
const NLCLogger = require('nlc-util/src/logger/NLCLogger');
const FS = require('fs');
const OS = require('os');

module.exports = class NLCManager {

  async boot(cwd = null) {
    cwd = cwd || process.cwd();
    this._roots = {};

    this.init('cwd', cwd);
    this.init('home', OS.homedir());
    this.init('nlc', module);

    const logger = new NLCLogger();

    logger.install(this._roots.nlc.nlc.logger);

    const log = logger.logger('ok');

    log.all('all');
    log.trace('trace');
    log.debug('debug');
    log.info('info');
    log.warn('warn');
    log.error('error');
    log.fatal('fatal');
  }

  init(name, context) {
    const root = Finder(context).next();

    if (root !== undefined && root.value !== undefined) {
      const nlc = require.resolve(root.value.name + '/nlc.json');

      if (FS.existsSync(nlc)) {
        this._roots[name] = root;
        this._roots[name].nlc = require(nlc);
      }
    }
  }

}
