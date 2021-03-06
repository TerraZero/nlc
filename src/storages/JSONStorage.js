const FS = require('fs');
const NLC = require('../../index');

module.exports = class JSONStorage extends NLC.storages.Storage {

  create(path) {
    this._path = path;
    if (FS.existsSync(this._path)) {
      this._data = require(this._path);
    }
    return this;
  }

  path() {
    return this._path;
  }

  save(readable = true) {
    if (!this.editable) return false;

    try {
      if (readable) {
        FS.writeFileSync(this.path(), JSON.stringify(this.data(), null, '  '));
      } else {
        FS.writeFileSync(this.path(), JSON.stringify(this.data()));
      }
      return true;
    } catch (e) {
      return e;
    }
  }

}
