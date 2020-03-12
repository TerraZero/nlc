import Core from 'nlc/src/Core';

export default class NLC {

  static init(require) {
    if (this._core === undefined) {
      this._core = new Core(require);
    }
    return this._core;
  }

  /**
   * @returns {Core}
   */
  static get core() {
    return this._core;
  }

};
