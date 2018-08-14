import EventEmitter from 'events';

/**
 * A viewer resource.
 * Generally speaking resources are created via viewer.load().
 * Resources include models, textures, or any arbitrary file types that have handlers (e.g. INI).
 */
export default class Resource extends EventEmitter {
  /**
   * @param {Object} resourceData
   */
  constructor({viewer, handler, extension, pathSolver, fetchUrl = ''}) {
    super();

    /** @member {ModelViewer.viewer.ModelViewer} */
    this.viewer = viewer;
    /** @member {Handler} */
    this.handler = handler || null;
    /** @member {string} */
    this.extension = extension || '';
    /** @member {function(?)} */
    this.pathSolver = pathSolver || null;
    /** @member {string} */
    this.fetchUrl = fetchUrl;
    /** @member {boolean} */
    this.ok = false;
    /** @member {boolean} */
    this.loaded = false;
  }

  /**
   * Will be called when the data for this resource is ready.
   * If it was loaded from memory, it will be called instantly.
   * Otherwise it will be called when the server fetch finishes, assuming it succeeded.
   *
   * @param {string|ArrayBuffer|Image} src
   */
  loadData(src) {
    this.loaded = true;

    // In case the resource parsing/loading fails, e.g. if the source is not valid.
    try {
      this.load(src);

      this.ok = true;

      this.lateLoad();

      this.emit('load', this);
      this.emit('loadend', this);
    } catch (e) {
      this.error('InvalidData', e);
    }
  }

  /**
   * @param {*} src
   */
  load(src) {

  }

  /**
   * Remove this resource from its viewer's cache.
   * Equivalent to viewer.unload(resource).
   *
   * @return {boolean}
   */
  detach() {
    return this.viewer.unload(this);
  }

  /**
   * This is used by models to finish loading their instances and model views, in case any are added before the model finished loaded.
   */
  lateLoad() {

  }

  /**
   * Called when an error happens while loading the resource.
   * This includes both fetching and parsing errors.
   *
   * @param {string} error
   * @param {*} reason
   */
  error(error, reason) {
    this.loaded = true;

    this.emit('error', this, error, reason);
    this.emit('loadend', this);
  }

  /**
   * Similar to attaching an event listener to the 'loadend' event, but handles the case where the resource already loaded, and the callback should still be called.
   *
   * @return {Promise}
   */
  whenLoaded() {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        resolve(this);
      } else {
        this.once('loadend', () => resolve(this));
      }
    });
  }
}
