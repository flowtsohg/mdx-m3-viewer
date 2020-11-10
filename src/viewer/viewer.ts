import { EventEmitter } from 'events';
import { FetchDataTypeName, FetchDataType, FetchResult, fetchDataType } from '../common/fetchdatatype';
import mapequals from '../common/mapequals';
import WebGL from './gl/gl';
import Scene from './scene';
import { Resource } from './resource';
import { PathSolver, HandlerResourceData, HandlerResource } from './handlerresource';
import GenericResource from './genericresource';
import ClientBuffer from './gl/clientbuffer';
import Model from './model';
import ModelInstance from './modelinstance';
import TextureMapper from './texturemapper';
import Texture from './texture';
import { isImageSource, ImageTexture, detectMime } from './imagetexture';
import { blobToImage } from '../common/canvas';

/**
 * The minimal structure of handlers.
 * 
 * Additional data can be added to them for the purposes of the implementation.
 */
export interface Handler {
  load?: (viewer: ModelViewer) => void;
  isValidSource: (src: any) => boolean;
  resource: new (src: any, resourceData: HandlerResourceData) => HandlerResource
}

/**
 * A model viewer.
 */
export default class ModelViewer extends EventEmitter {
  resources: Resource[] = [];
  /**
   * A cache of resources that were fetched.
   */
  fetchCache: Map<string, Resource> = new Map();
  promiseCache: Map<string, Promise<Resource | undefined>> = new Map();
  handlers: Set<Handler> = new Set();
  frameTime: number = 1000 / 60;
  canvas: HTMLCanvasElement;
  webgl: WebGL;
  gl: WebGLRenderingContext;
  scenes: Scene[] = [];
  visibleCells: number = 0;
  visibleInstances: number = 0;
  updatedParticles: number = 0;
  frame: number = 0;
  /**
   * A resizeable buffer that can be used by any part of the library.
   * 
   * The data it contains is temporary, and can be overwritten at any time.
   */
  buffer: ClientBuffer;
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
  textureMappers: Map<Model, TextureMapper[]> = new Map();
  /**
   * A cache of arbitrary data, shared between all of the handlers.
   */
  sharedCache: Map<any, any> = new Map();

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
  addHandler(handler: Handler) {
    if (handler) {
      let handlers = this.handlers;

      // Check to see if this handler was added already.
      if (!handlers.has(handler)) {
        if (!handler.isValidSource) {
          this.emit('error', this, 'Handler missing the isValidSource function', handler);
          return false;
        }

        // Check if the handler has a loader, and if so load it.
        if (handler.load) {
          try {
            handler.load(this);
          } catch (e) {
            this.emit('error', this, `Handler failed to load`, { handler, e });

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

  async load(src: any, pathSolver?: PathSolver, solverParams?: any) {
    let finalSrc: any;
    let fetchUrl = '';

    // Run the path solver if there is one.
    if (pathSolver) {
      finalSrc = pathSolver(src, solverParams);
    } else {
      finalSrc = src;
    }

    // If the final source is a string, and doesn't match any handler, it is assumed to be an URL to fetch.
    if (typeof finalSrc === 'string' && !this.detectFormat(finalSrc)) {
      // Check the promise cache and return a promise if one exists.
      let promise = this.promiseCache.get(finalSrc);
      if (promise) {
        return promise;
      }

      // Check the fetch cache and return a resource if one exists.
      let resource = this.fetchCache.get(finalSrc);
      if (resource) {
        return resource;
      }

      // Otherwise promise to fetch the data and construct a resource.
      let fetchPromise = fetchDataType(finalSrc, 'arrayBuffer')
        .then(async (value) => {
          // Once the resource finished loading (successfully or not), the promise can be removed from the promise cache.
          this.promiseCache.delete(finalSrc);

          let resource;

          if (value.ok) {
            resource = await this.loadDirect(value.data, finalSrc, pathSolver);

            // And if the resource loaded successfully, add it to the fetch cache.
            if (resource) {
              this.fetchCache.set(finalSrc, resource);
              this.resources.push(resource);
            }

            this.emit('load', this, finalSrc);
          } else {
            this.emit('error', this, 'Failed to fetch a resource', finalSrc);
          }

          this.emit('loadend', this, finalSrc);
          this.checkLoadingStatus();

          return resource;
        });

      // Add the promise to the promise cache.
      this.promiseCache.set(finalSrc, fetchPromise);
      this.emit('loadstart', this, finalSrc);

      return fetchPromise;
    }

    return this.loadDirect(finalSrc, fetchUrl, pathSolver);
  }

  async loadDirect(src: any, fetchUrl: string, pathSolver?: PathSolver) {
    // If the source is an image source, load it directly.
    if (isImageSource(src)) {
      return new ImageTexture(src, { viewer: this, fetchUrl, pathSolver });
    }

    // If the source is a buffer of an image, convert it to an image, and load it directly.
    if (src instanceof ArrayBuffer) {
      let type = detectMime(src);

      if (type.length) {
        return new ImageTexture(await blobToImage(new Blob([src], { type })), { viewer: this, fetchUrl, pathSolver });
      }
    }

    // Attempt to match the source to a handler.
    let handler = this.detectFormat(src);

    if (handler) {
      try {
        let resource = new handler.resource(src, { viewer: this, fetchUrl, pathSolver });

        // If the resource is blocked by internal resources being loaded, wait for them and then clear them.
        await Promise.all(resource.blockers);
        resource.blockers.length = 0;

        return resource;
      } catch (e) {
        this.emit('error', this, 'Failed to create a resource', { fetchUrl, e });
      }
    } else {
      this.emit('error', this, 'Source has no matching handler', { fetchUrl, src });
    }
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
    return this.fetchCache.has(key);
  }

  /**
   * Get a resource from the cache.
   */
  get(key: string) {
    return this.fetchCache.get(key);
  }

  /**
   * Load something generic.
   * 
   * Unlike load(), this does not use handlers or construct any internal objects.
   * 
   * `dataType` can be one of: `"image"`, `"string"`, `"arrayBuffer"`, `"blob"`.
   * 
   * If `callback` isn't given, the resource's `data` is the fetch data, according to `dataType`.
   * 
   * If `callback` is given, the resource's `data` is the value returned by it when called with the fetch data.
   * 
   * If `callback` returns a promise, the resource's `data` will be whatever the promise resolved to.
   */
  async loadGeneric(path: string, dataType: FetchDataTypeName, callback?: (data: FetchDataType) => any) {
    // Check the promise cache and return a promise if one exists.
    let promise = this.promiseCache.get(path);
    if (promise) {
      return <Promise<GenericResource>>promise;
    }

    // Check the fetch cache and return a resource if one exists.
    let resource = this.fetchCache.get(path);
    if (resource) {
      return <GenericResource>resource;
    }

    let fetchPromise = fetchDataType(path, dataType)
      .then(async (value: FetchResult) => {
        // Once the resource finished loading (successfully or not), the promise can be removed from the promise cache.
        this.promiseCache.delete(path);

        let resource;

        if (value.ok) {
          let data = value.data;

          if (callback) {
            data = await callback(<FetchDataType>data);
          }

          resource = new GenericResource(data, { viewer: this, fetchUrl: path });

          this.fetchCache.set(path, resource);
          this.resources.push(resource);

          this.emit('load', this, path);
        } else {
          this.emit('error', this, 'Failed to fetch a generic resource', path);
        }

        this.emit('loadend', this, path);
        this.checkLoadingStatus();

        return resource;
      });

    this.promiseCache.set(path, fetchPromise);
    this.emit('loadstart', this, path);

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
      this.fetchCache.delete(fetchUrl);
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

    this.promiseCache.set(key, promise);

    return () => {
      this.promiseCache.delete(key);
      this.checkLoadingStatus();
    };
  }

  checkLoadingStatus() {
    if (this.promiseCache.size === 0) {
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
      if (this.promiseCache.size === 0) {
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

  baseTextureMapper(model: Model) {
    let textureMappers = this.textureMappers;

    if (!textureMappers.has(model)) {
      textureMappers.set(model, []);
    }

    let mappers = <TextureMapper[]>textureMappers.get(model);

    if (!mappers.length) {
      mappers[0] = new TextureMapper(model);
    }

    return mappers[0];
  }

  changeTextureMapper(instance: ModelInstance, key: any, texture?: Texture) {
    let map = new Map(instance.textureMapper.textures);

    if (texture instanceof Texture) {
      map.set(key, texture);
    } else {
      map.delete(key);
    }

    let model = instance.model;
    let mappers = <TextureMapper[]>this.textureMappers.get(model);

    for (let mapper of mappers) {
      if (mapequals(mapper.textures, map)) {
        return mapper;
      }
    }

    let mapper = new TextureMapper(model, map);

    mappers.push(mapper);

    return mapper;
  }
}
