const FS = require('fs');
const Path = require('path');

const NLC = require('../../index');

module.exports = class Launcher {

  /**
   * @param {string} filename
   */
  constructor(filename) {
    this._filename = filename;
    this._loaded = {};
  }

  /**
   * @returns {string}
   */
  get filename() {
    return this._filename;
  }

  /**
   * @returns {Object<string, import('../../defs').LauncherDefinition>}
   */
  get loaded() {
    return this._loaded;
  }

  getFiles(path) {
    const files = [];

    for (const index in this.loaded) {
      const definition = this.loaded[index];
      const file = Path.join(definition.root, path);

      if (FS.existsSync(file)) {
        files.push({
          index,
          file,
        });
      }
    }
    return files;
  }

  /**
   * @param {string} name
   * @returns {any}
   */
  getConfig(name) {
    for (const item in this.loaded) {
      if (this.loaded[item].name === name) {
        return this.loaded[item];
      }
    }
    return null;
  }

  /**
   * @param {string} name
   * @param {string} path
   * @param {boolean} bubble
   */
  boot(name, path, bubble = true) {
    path = Path.normalize(path);
    const root = this.lookup(path, bubble);

    if (root && !this.loaded[root]) {
      const storage = new NLC.storages.JSONStorage({ name, path, root });

      this.loaded[root] = {
        name,
        root,
        config: storage.create(Path.join(root, this.filename + '.json')).setEditable(),
      };

      if (this.loaded[root].config.get('extensions')) {
        for (const name in this.loaded[root].config.get('extensions')) {
          this.boot(name, Path.join(root, this.loaded[root].config.get('extensions.' + name)));
        }
      }
    }
  }

  /**
   * @param {string} path
   * @param {boolean} bubble
   * @returns {string}
   */
  lookup(path, bubble = true) {
    while (path) {
      let back = path;

      if (FS.existsSync(Path.join(path, this.filename + '.json'))) return path;
      path = Path.join(path, '..');
      if (back === path) break;
      if (!bubble) return null;
    }
    return null;
  }

}
