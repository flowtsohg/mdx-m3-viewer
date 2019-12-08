import { EventEmitter } from 'events';
import ModelViewer from './viewer';

/**
 * A viewer resource.
 * 
 * Generally speaking resources are created via viewer.load(), or viewer.loadGeneric().
 */
export default class Resource extends EventEmitter {
  viewer: ModelViewer;
  handler: object;
  extension: string;
  pathSolver: PathSolver | null;
  fetchUrl: string;
  ok: boolean;
  loaded: boolean;

  constructor(resourceData: ResourceData) {
    super();

    this.viewer = resourceData.viewer;
    this.handler = resourceData.handler || null;
    this.extension = resourceData.extension || '';
    this.pathSolver = resourceData.pathSolver || null;
    this.fetchUrl = resourceData.fetchUrl || '';
    this.ok = false;
    this.loaded = false;

    // Ignore EventEmitter warnings.
    // Mostly relevant when loading many models that reference the same texture / event object.
    this.setMaxListeners(0);
  }

  /**
   * Will be called when the data for this resource is ready.
   * If it was loaded from memory, it will be called instantly.
   * Otherwise it will be called when the server fetch finishes, assuming it succeeded.
   */
  loadData(src: any) {
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
   * Called when the data for this resource is ready.
   */
  load(src: any) {

  }

  /**
   * Remove this resource from its viewer's cache.
   * 
   * Equivalent to viewer.unload(resource).
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
   */
  error(error: string, reason: any) {
    this.loaded = true;

    this.emit('error', this, error, reason);
    this.emit('loadend', this);
  }

  /**
   * Wait for this resource to load.
   * Similar to attaching an event listener to the 'loadend' event, but handles the case where the resource already loaded, and code should still run.
   * If a callback is given, it will be called.
   * Otherwise a promise is returned.
   */
  whenLoaded(callback?: (resource: Resource) => void) {
    let promise = new Promise((resolve: (resource: Resource) => void) => {
      if (this.loaded) {
        resolve(this);
      } else {
        this.once('loadend', () => resolve(this));
      }
    });

    if (callback) {
      promise.then(() => callback(this));
    } else {
      return promise;
    }
  }
}
