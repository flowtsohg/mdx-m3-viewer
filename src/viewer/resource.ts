import { EventEmitter } from 'events';
import ModelViewer from './viewer';

/**
 * The data sent to every resource as a part of the loading process.
 */
export type ResourceData = { viewer: ModelViewer, extension?: string, fetchUrl?: string };

/**
 * A viewer resource.
 * 
 * Generally speaking resources are created via viewer.load(), or viewer.loadGeneric().
 */
export abstract class Resource extends EventEmitter {
  viewer: ModelViewer;
  extension: string;
  fetchUrl: string;
  ok: boolean = false;
  loaded: boolean = false;

  constructor(resourceData: ResourceData) {
    super();

    this.viewer = resourceData.viewer;
    this.extension = resourceData.extension || '';
    this.fetchUrl = resourceData.fetchUrl || '';

    // Ignore EventEmitter warnings.
    // Mostly relevant when loading many models that reference the same texture / event object.
    this.setMaxListeners(0);
  }

  /**
   * Called when the data for this resource is ready.
   * 
   * If a promise is returned, the resource waits for it to resolve before finalizing.
   */
  abstract load(src?: any): void;

  /**
   * Will be called when the data for this resource is ready.
   * 
   * If it was loaded from memory, it will be called instantly.
   * 
   * Otherwise it will be called when the server fetch finishes, assuming it succeeded.
   */
  loadData(src?: any) {
    try {
      this.load(src);

      this.loaded = true;
      this.ok = true;

      this.lateLoad();

      this.emit('load', this);
      this.emit('loadend', this);
    } catch (e) {
      this.error('An exception was thrown while loading', e);
    }
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
   * This is used by models to finalize instances of them that were created before they finished loading.
   */
  lateLoad() {

  }

  /**
   * Called when an error happens while loading the resource.
   */
  error(error: string, reason: any) {
    this.loaded = true;
    this.ok = false;

    this.emit('error', this, error, reason);
    this.emit('loadend', this);
  }

  /**
   * Wait for this resource to load.
   * 
   * Similar to attaching an event listener to the 'loadend' event, but handles the case where the resource already loaded, and code should still run.
   * 
   * If a callback is given, it will be called, otherwise a promise is returned.
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
