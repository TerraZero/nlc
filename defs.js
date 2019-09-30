const NLC = require('./index');

/**
 * @typedef {Object} LauncherDefinition
 * @property {string} name
 * @property {string} root
 * @property {NLC.storages.JSONStorage} config
 */

/**
 * @callback Inserter
 * @property {string} value
 */

/**
 * @typedef {Object} CommandDefinition
 * @property {string} path
 * @property {string} file
 * @property {string} name
 * @property {string} pattern
 * @property {NLC.Command} command
 */

/**
 * @typedef {Object} ServiceDefinition
 * @property {string} name
 * @property {string[]} dependencies
 * @property {string} file
 * @property {Object} service
 */

/**
 * @callback loadingCallback
 * @param {NLC.storages.JSONStorage} config
 * @param {string} path
 */

/**
 * @callback eventListener
 * @param {NLC.sys.Event} event
 */
