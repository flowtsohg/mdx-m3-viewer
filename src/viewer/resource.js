import EventDispatcher from './eventdispatcher';

/**
 * A viewer resource.
 * Generally speaking resources are created via viewer.load().
 * Resources include models, textures, or any arbitrary file types that have handlers (e.g. INI).
 */
export default class Resource extends EventDispatcher {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super();

    /** @member {ModelViewer.viewer.ModelViewer} */
    this.viewer = resourceData.viewer;
    /** @member {Handler} */
    this.handler = resourceData.handler;
    /** @member {string} */
    this.extension = resourceData.extension;
    /** @member {function(?)} */
    this.pathSolver = resourceData.pathSolver;
    /** @member {string} */
    this.fetchUrl = resourceData.fetchUrl;
    /** @member {boolean} */
    this.loaded = false;
    /** @member {boolean} */
    this.errored = false;
  }

  /**
   * Will be called when the data for this resource is ready.
   * If it was loaded from memory, it will be called instantly.
   * Otherwise it will be called when the server fetch finishes, assuming it succeeded.
   *
   * @param {*} src
   */
  loadData(src) {
    // In case the resource parsing/loading fails, e.g. if the source is not valid.
    try {
      this.load(src);

      this.loaded = true;

      this.lateLoad();

      this.dispatchEvent({type: 'load'});
      this.dispatchEvent({type: 'loadend'});
    } catch (e) {
      this.error('InvalidData', e);
    }
  }

  /**
   * This is used by models to finish loading their instances and model views, in case any are added before the model loaded.
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
    this.errored = true;

    this.dispatchEvent({type: 'error', error, reason});
    this.dispatchEvent({type: 'loadend'});
  }

  /**
   * Similar to attaching an event listener to the 'loadend' event, but handles the case where the resource already loaded, and the callback should still be called.
   *
   * @return {Promise}
   */
  whenLoaded() {
    return new Promise((resolve, reject) => {
      if (this.loaded || this.errored) {
        resolve(this);
      } else {
        this.once('loadend', () => resolve(this));
      }
    });
  }
}
