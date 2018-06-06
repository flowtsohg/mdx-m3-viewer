import EventDispatcher from './eventdispatcher';

/**
 * This object is used to promise about future resource loads, in case they are not yet known.
 * It is needed to stop the viewer from preemtively calling whenAllLoaded.
 *
 * An example of this is MDX event objects.
 * First the SLK their data is contained in needs to be loaded, and only then can the actual objects be loaded.
 * Once the SLK loads, the viewer thinks it finished loading and calls whenAllLoaded, before starting to load the objects.
 * Adding a promise in this case acts as a barrier, which is removed by resolving the promise after the objects starts loading.
 *
 * Note that you can create a promise resource with viewer.makePromise(), which returns an already active promise.
 */
export default class PromiseResource extends EventDispatcher {
  /**
   * Immitates a promise.
   */
  promise() {
    this.dispatchEvent({type: 'loadstart'});
  }

  /**
   * Immitates promise resolution.
   */
  resolve() {
    this.dispatchEvent({type: 'loadend'});
  }
}
