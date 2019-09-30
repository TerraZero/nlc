module.exports.sys = {};
module.exports.sys.Reflection = require('./src/sys/Reflection');
module.exports.sys.Launcher = require('./src/sys/Launcher');
module.exports.sys.Event = require('./src/sys/Event');
module.exports.sys.Bag = require('./src/sys/Bag');
module.exports.sys.BagCollection = require('./src/sys/BagCollection');
module.exports.sys.ConfigManager = require('./src/sys/ConfigManager');

module.exports.errors = {};
module.exports.errors.Error = require('./src/errors/Error');
module.exports.errors.CommandError = require('./src/errors/CommandError');
module.exports.errors.ManagerError = require('./src/errors/ManagerError');

module.exports.factories = {};
module.exports.factories.Factory = require('./src/factories/Factory');
module.exports.factories.ServiceFactory = require('./src/factories/ServiceFactory');

module.exports.loggers = {};
module.exports.loggers.Logger = require('./src/loggers/Logger.service');

module.exports.storages = {};
module.exports.storages.Storage = require('./src/storages/Storage');
module.exports.storages.JSONStorage = require('./src/storages/JSONStorage');

module.exports.Request = require('./src/Request');
module.exports.Command = require('./src/Command');
module.exports.Manager = require('./src/Manager');

module.exports.Commander = require('commander');

let manager = null;

/**
 * @returns {import('./src/Manager')}
 */
module.exports.get = function get() {
  if (manager === null) {
    manager = new module.exports.Manager();

    manager.boot();
  }
  return manager;
};
