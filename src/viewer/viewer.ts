import { EventEmitter } from 'events';
import { FetchDataTypeName, FetchDataType, FetchResult, fetchDataType } from '../common/fetchdatatype';
import WebGL from './gl/gl';
import Scene from './scene';
import { Resource } from './resource';
import { PathSolver, HandlerResourceData, HandlerResource } from './handlerresource';
import GenericResource from './genericresource';
import ClientBuffer from './gl/clientbuffer';
import { isImageSource, ImageTexture, detectMime } from './imagetexture';
import { blobToImage } from '../common/canvas';

/**
 * A viewer handler.
 */
export interface Handler {
  load?: (viewer: ModelViewer, ...args: any[]) => void;
  isValidSource: (src: any) => boolean;
  resource: new (src: any, resourceData: HandlerResourceData) => HandlerResource
}

/**
 * A model viewer.
 */
export default class ModelViewer extends EventEmitter {
  /**
   * The viewer's canvas.
   */
  canvas: HTMLCanvasElement;
  /**
   * The viewer's WebGL context.
   */
  gl: WebGLRenderingContext;
  /**
   * A wrapper around the viewer's WebGL context with utility functions.
   */
  webgl: WebGL;
  /**
   * All of the loaded resources.
   */
  resources: Resource[] = [];
  /**
   * A map from urls to their resources.
   * 
   * Only used by fetched resources.
   */
  resourceMap: Map<string, Resource> = new Map();
  /**
   * A map from urls to the promises that load them.
   * 
   * Only used by fetched resources.
   */
  promiseMap: Map<string, Promise<Resource | undefined>> = new Map();
  /**
   * The viewer's handlers, added with `addHandler()`.
   */
  handlers: Set<Handler> = new Set();
  /**
   * The viewer's scenes, added with `addScene()`.
   */
  scenes: Scene[] = [];
  /**
   * The number of animation frames advanced on every viewer update.
   */
  frameTime: number = 1000 / 60;
  /**
   * The current frame.
   */
  frame: number = 0;
  /**
   * The number of visible cells on the current frame.
   */
  visibleCells: number = 0;
  /**
   * The number of visible instances on the current frame.
   */
  visibleInstances: number = 0;
  /**
   * The number of particles being updated on the current frame.
   */
  updatedParticles: number = 0;
  /**
   * A viewer-wide flag.
   * 
   * If it is false, not only will audio not run, but in fact audio files won't even be fetched in the first place.
   * 
   * If audio is desired, this should be set to true before loading models that use audio.
   * 
   * Note that it is preferable to call enableAudio(), which checks for the existence of AudioContext.
   */
  audioEnabled: boolean = false;
  /**
   * A resizeable buffer that can be used by any part of the library.
   * 
   * The data it contains is temporary, and can be overwritten at any time.
   */
  buffer: ClientBuffer;
  /**
   * A cache of arbitrary data, shared between all of the handlers.
   */
  sharedCache: Map<any, any> = new Map();

  directLoadId: number = 0;

  constructor(canvas: HTMLCanvasElement, options?: object) {
    super();

    this.canvas = canvas;
    this.webgl = new WebGL(canvas, options);
    this.gl = this.webgl.gl;
    this.buffer = new ClientBuffer(this.gl);
  }

  /**
   * Enable audio if AudioContext is available.
   */
  enableAudio() {
    if (typeof AudioContext === 'function') {
      this.audioEnabled = true;

      return true;
    }

    return false;
  }

  /**
   * Add an handler.
   */
  addHandler(handler: Handler, ...args: any[]) {
    if (handler) {
      let handlers = this.handlers;

      // Check to see if this handler was added already.
      if (!handlers.has(handler)) {
        if (!handler.isValidSource) {
          this.emit('error', { viewer: this, error: 'Handler missing the isValidSource function', handler });
          return false;
        }

        // Check if the handler has a loader, and if so load it.
        if (handler.load) {
          try {
            handler.load(this, ...args);
          } catch (e) {
            this.emit('error', { viewer: this, error: `Handler failed to load`, handler, reason: e });

            return false;
          }
        }

        handlers.add(handler);

        return true;
      }
    }

    return false;
  }

  /**
   * Add a scene.
   */
  addScene() {
    let scene = new Scene(this);

    this.scenes.push(scene);

    return scene;
  }

  /**
   * Remove a scene.
   */
  removeScene(scene: Scene) {
    let scenes = this.scenes;
    let index = scenes.indexOf(scene);

    if (index !== -1) {
      scenes.splice(index, 1);

      return true;
    }

    return false;
  }

  /**
   * Removes all of the scenes in the viewer.
   */
  clear() {
    this.scenes.length = 0;
  }

  /**
   * Given a source and an optional path solver, loads a resource and returns a promise to it.
   */
  async load(src: any, pathSolver?: PathSolver, solverParams?: any) {
    let finalSrc: any;
    let fetchUrl = '';
    let promise;

    // Run the path solver if there is one.
    if (pathSolver) {
      try {
        finalSrc = pathSolver(src, solverParams);
      } catch (e) {
        this.emit('error', { viewer: this, error: `Path solver failed`, src, reason: e, pathSolver, solverParams });

        return;
      }
    } else {
      finalSrc = src;
    }

    if (!finalSrc) {
      return;
    }

    // Allow path solvers to return promises.
    if (finalSrc instanceof Promise) {
      finalSrc = await finalSrc;
    }

    // Give path solvers the option to inject resources.
    if (finalSrc instanceof Resource) {
      return finalSrc;
    }

    // If the final source is a string, and doesn't match any handler, it is assumed to be an URL to fetch.
    if (typeof finalSrc === 'string' && !this.detectFormat(finalSrc)) {
      fetchUrl = finalSrc;

      // Check the promise cache and return a promise if one exists.
      promise = this.promiseMap.get(fetchUrl);
      if (promise) {
        return promise;
      }

      // Check the fetch cache and return a resource if one exists.
      let resource = this.resourceMap.get(fetchUrl);
      if (resource) {
        return resource;
      }

      // Otherwise promise to fetch the data and construct a resource.
      promise = fetchDataType(fetchUrl, 'arrayBuffer')
        .then((value) => {
          if (value.ok) {
            return value.data;
          } else {
            this.emit('error', { viewer: this, error: `Failed to fetch a resource: ${value.error}`, fetchUrl, reason: value.data });
          }
        });
    } else {
      fetchUrl = `__DIRECT_LOAD_${this.directLoadId++}`;
      promise = Promise.resolve(finalSrc);
    }

    promise = promise
      .then(async (actualSrc) => {
        // finalSrc will be undefined if this is a fetch and the fetch failed.
        if (actualSrc) {
          if (actualSrc instanceof ArrayBuffer) {
            actualSrc = new Uint8Array(actualSrc);
          }

          // If the source is an image source, load it directly.
          if (isImageSource(actualSrc)) {
            return new ImageTexture(actualSrc, { viewer: this, fetchUrl, pathSolver });
          }

          // If the source is a buffer of an image, convert it to an image, and load it directly.
          if (actualSrc instanceof Uint8Array) {
            let type = detectMime(actualSrc);

            if (type.length) {
              return new ImageTexture(await blobToImage(new Blob([actualSrc.buffer], { type })), { viewer: this, fetchUrl, pathSolver });
            }
          }

          // Attempt to match the source to a handler.
          let handler = this.detectFormat(actualSrc);

          if (handler) {
            try {
              let resource = new handler.resource(actualSrc, { viewer: this, fetchUrl, pathSolver });

              // If the resource is blocked by internal resources being loaded, wait for them and then clear them.
              await Promise.all(resource.blockers);
              resource.blockers.length = 0;

              return resource;
            } catch (e) {
              this.emit('error', { viewer: this, error: 'Failed to create a resource', fetchUrl, src, reason: e });
            }
          } else {
            this.emit('error', { viewer: this, error: 'Source has no matching handler', fetchUrl, src });
          }
        }
      })
      .then((resource) => {
        this.promiseMap.delete(fetchUrl);

        if (resource) {
          this.resourceMap.set(fetchUrl, resource);
          this.resources.push(resource);

          this.emit('load', { viewer: this, fetchUrl, resource });
        }

        this.emit('loadend', { viewer: this, fetchUrl, resource });
        this.checkLoadingStatus();

        return resource;
      });

    this.promiseMap.set(fetchUrl, promise);
    this.emit('loadstart', { viewer: this, fetchUrl, promise });

    return promise;
  }

  detectFormat(src: any) {
    for (let handler of this.handlers) {
      if (handler.isValidSource(src)) {
        return handler;
      }
    }
  }

  /**
   * Check whether the given string maps to a resource in the cache.
   */
  has(key: string) {
    return this.resourceMap.has(key);
  }

  /**
   * Get a resource from the cache.
   */
  get(key: string) {
    return this.resourceMap.get(key);
  }

  /**
   * Load something generic.
   * 
   * Unlike load(), this does not use handlers or construct any internal objects.
   * 
   * `dataType` can be one of: `"image"`, `"string"`, `"arrayBuffer"`, `"bytes"`, `"blob"`.
   * 
   * If `callback` isn't given, the resource's `data` is the fetch data, according to `dataType`.
   * 
   * If `callback` is given, the resource's `data` is the value returned by it when called with the fetch data.
   * 
   * If `callback` returns a promise, the resource's `data` will be whatever the promise resolved to.
   */
  async loadGeneric(fetchUrl: string, dataType: FetchDataTypeName, callback?: (data: FetchDataType) => any) {
    // Check the promise cache and return a promise if one exists.
    let promise = this.promiseMap.get(fetchUrl);
    if (promise) {
      return <Promise<GenericResource>>promise;
    }

    // Check the fetch cache and return a resource if one exists.
    let resource = this.resourceMap.get(fetchUrl);
    if (resource) {
      return <GenericResource>resource;
    }

    let fetchPromise = fetchDataType(fetchUrl, dataType)
      .then(async (value: FetchResult) => {
        // Once the resource finished loading (successfully or not), the promise can be removed from the promise cache.
        this.promiseMap.delete(fetchUrl);

        let resource;

        if (value.ok) {
          let data = value.data;

          if (callback) {
            data = await callback(<FetchDataType>data);
          }

          resource = new GenericResource(data, { viewer: this, fetchUrl });

          this.resourceMap.set(fetchUrl, resource);
          this.resources.push(resource);

          this.emit('load', { viewer: this, fetchUrl, resource });
        } else {
          this.emit('error', { viewer: this, error: 'Failed to fetch a generic resource', fetchUrl });
        }

        this.emit('loadend', { viewer: this, fetchUrl, resource });
        this.checkLoadingStatus();

        return resource;
      });

    this.promiseMap.set(fetchUrl, fetchPromise);
    this.emit('loadstart', { viewer: this, fetchUrl });

    return fetchPromise;
  }

  /**
   * Unload a resource.
   * Note that this only removes the resource from the viewer's cache.
   * If it's being referenced and used e.g. by a scene, it will not be garbage collected.
   */
  unload(resource: Resource) {
    let fetchUrl = resource.fetchUrl;

    if (fetchUrl !== '') {
      this.resourceMap.delete(fetchUrl);
    }

    let resources = this.resources;
    let index = resources.indexOf(resource);

    if (index !== -1) {
      resources.splice(index, 1);

      return true;
    }

    return false;
  }

  /**
   * Starts loading a new empty resource, and returns it.
   * This empty resource will block the "idle" event (and thus whenAllLoaded) until it's resolved.
   * This is used when a resource might get loaded in the future, but it is not known what it is yet.
   */
  promise() {
    let promise = Promise.resolve(undefined);
    let key = `${performance.now()}`;

    this.promiseMap.set(key, promise);

    return () => {
      this.promiseMap.delete(key);
      this.checkLoadingStatus();
    };
  }

  checkLoadingStatus() {
    if (this.promiseMap.size === 0) {
      // A timeout is used so that this event will arrive after the current frame to let everything settle.
      setTimeout(() => this.emit('idle'), 0);
    }
  }

  /**
   * Wait for all of the resources to load.
   * 
   * If a callback is given, it will be called, otherwise, a promise is returned.
   */
  whenAllLoaded(callback?: (viewer: ModelViewer) => void) {
    let promise = new Promise((resolve: (viewer: ModelViewer) => void) => {
      if (this.promiseMap.size === 0) {
        resolve(this);
      } else {
        this.once('idle', () => resolve(this));
      }
    });

    if (callback) {
      promise.then(() => callback(this));
    } else {
      return promise;
    }
  }

  /**
   * Get a blob representing the contents of the viewer's canvas.
   * 
   * If a callback is given, it will be called, otherwise, a promise is returned.
   */
  toBlob(callback?: BlobCallback) {
    let promise = new Promise((resolve: BlobCallback) => this.canvas.toBlob((blob) => resolve(blob)));

    if (callback) {
      promise.then((blob) => callback(blob));
    } else {
      return promise;
    }
  }

  /**
   * Update and render a frame.
   */
  updateAndRender() {
    this.update();
    this.startFrame();
    this.render();
  }

  /**
   * Update all of the scenes, which includes updating their cameras, audio context if one exists, and all of the instances they hold.
   */
  update() {
    let dt = this.frameTime * 0.001;

    this.frame += 1;

    this.visibleCells = 0;
    this.visibleInstances = 0;
    this.updatedParticles = 0;

    for (let scene of this.scenes) {
      scene.update(dt);

      this.visibleCells += scene.visibleCells;
      this.visibleInstances += scene.visibleInstances;
      this.updatedParticles += scene.updatedParticles;
    }
  }

  /**
   * Clears the WebGL buffer.
   * 
   * Called automatically by updateAndRender().
   * 
   * Call this at some point before render() if you need more control.
   */
  startFrame() {
    let gl = this.gl;

    // See https://www.opengl.org/wiki/FAQ#Masking
    gl.depthMask(true);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Render.
   */
  render() {
    for (let scene of this.scenes) {
      scene.render();
    }
  }

  /**
   * Clear all of the emitted objects in this viewer.
   */
  clearEmittedObjects() {
    for (let scene of this.scenes) {
      scene.clearEmittedObjects();
    }
  }
}
