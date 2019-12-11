import { EventEmitter } from 'events';
import fetchDataType from '../common/fetchdatatype';
import mapequals from '../common/mapequals';
import WebGL from './gl/gl';
import PromiseResource from './promiseresource';
import Scene from './scene';
import imageTextureHandler from './handlers/imagetexture/handler';
import Resource from './resource';
import GenericResource from './genericresource';
import ClientBuffer from './gl/clientbuffer';
import ClientDataTexture from './gl/clientdatatexture';
import Model from './model';
import ModelInstance from './modelinstance';
import TextureMapper from './texturemapper';
import Texture from './texture';

/**
 * A model viewer.
 */
export default class ModelViewer extends EventEmitter {
  resources: Resource[];
  fetchCache: Map<string, Resource>;
  resourcesLoading: Set<Resource>;
  handlers: Set<object>;
  frameTime: number;
  canvas: HTMLCanvasElement;
  webgl: WebGL;
  gl: WebGLRenderingContext;
  scenes: Scene[];
  visibleCells: number;
  visibleInstances: number;
  updatedParticles: number;
  frame: number;
  /**
   * A simple buffer containing the bytes [0, 1, 2, 0, 2, 3].
   * These are used as vertices in all geometry shaders.
   */
  rectBuffer: WebGLBuffer;
  /**
   * A resizeable buffer that can be used by any part of the library.
   * The data it contains is temporary, and can be overwritten at any time.
   */
  buffer: ClientBuffer;
  /**
   * A resizeable data texture that can be used by any part of the library.
   * The data it contains is temporary, and can be overwritten at any time.
   */
  dataTexture: ClientDataTexture;
  /**
   * A viewer-wide flag.
   * If it is false, not only will audio not run, but in fact audio files won't even be fetched in the first place.
   * If audio is desired, this should be set to true before loading models that use audio.
   * Note that it is preferable to call enableAudio(), which checks for the existence of AudioContext.
   */
  audioEnabled: boolean;
  textureMappers: Map<Model, TextureMapper[]>;

  constructor(canvas: HTMLCanvasElement, options?: object) {
    super();

    this.resources = [];
    this.fetchCache = new Map();
    this.resourcesLoading = new Set();
    this.handlers = new Set();
    this.frameTime = 1000 / 60;
    this.canvas = canvas;
    this.webgl = new WebGL(canvas, options);
    this.gl = this.webgl.gl;
    this.scenes = [];
    this.visibleCells = 0;
    this.visibleInstances = 0;
    this.updatedParticles = 0;
    this.frame = 0;

    let gl = this.gl;

    this.rectBuffer = <WebGLBuffer>gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    this.buffer = new ClientBuffer(gl);
    this.dataTexture = new ClientDataTexture(gl);

    this.audioEnabled = false;

    this.textureMappers = new Map();

    // Track when resources start loading.
    this.on('loadstart', (target) => {
      this.resourcesLoading.add(target);
    });

    // Track when resources end loading.
    this.on('loadend', (target) => {
      this.resourcesLoading.delete(target);

      // If there are currently no resources loading, dispatch the 'idle' event.
      if (this.resourcesLoading.size === 0) {
        // A timeout is used so that this event will arrive after the loadend event being processed.
        setTimeout(() => this.emit('idle'), 0);
      }
    });

    this.addHandler(imageTextureHandler);
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
  addHandler(handler: object) {
    if (handler) {
      let handlers = this.handlers;

      // Allow to pass also the handler's module for convenience.
      if (handler.handler) {
        handler = handler.handler;
      }

      // Check to see if this handler was added already.
      if (!handlers.has(handler)) {
        // Check if the handler has a loader, and if so load it.
        if (handler.load && !handler.load(this)) {
          this.emit('error', this, 'InvalidHandler', 'FailedToLoad');
          return false;
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
   * Look for a handler matching the given extension.
   */
  findHandler(ext: string) {
    for (let handler of this.handlers) {
      for (let extention of handler.extensions) {
        if (ext === extention[0]) {
          return [handler, extention[1]];
        }
      }
    }
  }

  /**
   * Load something.
   *
   * @param src The source used for the load.
   * @param pathSolver The path solver used by this load, and any subsequent loads that are caused by it (for example, a model that loads its textures).
   * @param solverParams An optional object containing parameters to be passed to the path solver.
   */
  load(src: any, pathSolver?: PathSolver, solverParams?: any) {
    let finalSrc = src;
    let extension = '';
    let isFetch = false;
    let resolved = false;

    // If given a path solver, resolve.
    if (pathSolver) {
      let solved = pathSolver(src, solverParams);

      finalSrc = solved[0];
      extension = solved[1];
      isFetch = solved[2];
      resolved = true;
    }

    // Built-in texture sources.
    if ((finalSrc instanceof HTMLImageElement) || (finalSrc instanceof HTMLVideoElement) || (finalSrc instanceof HTMLCanvasElement) || (finalSrc instanceof ImageData) || (finalSrc instanceof WebGLTexture)) {
      extension = '.png';
      isFetch = false;
      resolved = true;
    }

    if (resolved) {
      let handlerAndDataType = this.findHandler(extension.toLowerCase());

      // Is there an handler for this file type?
      if (handlerAndDataType) {
        if (isFetch) {
          let resource = this.fetchCache.get(finalSrc);

          if (resource) {
            return resource;
          }
        }

        let handler = handlerAndDataType[0];
        let constructor = <typeof Resource>handler.Constructor;
        let resource = new constructor({ viewer: this, handler, extension, pathSolver, fetchUrl: isFetch ? finalSrc : '' });

        this.resources.push(resource);

        if (isFetch) {
          this.fetchCache.set(finalSrc, resource);
        }

        this.registerEvents(resource);

        resource.emit('loadstart', resource);

        if (isFetch) {
          let dataType = handlerAndDataType[1];

          fetchDataType(finalSrc, dataType)
            .then((response) => {
              let data = response.data;

              if (response.ok) {
                resource.loadData(data);
              } else {
                resource.error('FailedToFetch');

                this.emit('error', resource, response.error, data);
              }
            });
        } else {
          resource.loadData(finalSrc);
        }

        return resource;
      } else {
        this.emit('error', this, 'MissingHandler', [finalSrc, extension, isFetch]);
      }
    } else {
      this.emit('error', this, 'LoadUnresolved', src);
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
   * Load a resource generically.
   * Unlike load(), this does not use handlers or construct any internal objects.
   * If no callback is given, the resource's data is the fetch data.
   * If a callback is given, the resource's data is the value returned by it when called with the fetch data.
   * If a callback returns a promise, the resource's data will be the result of the promise.
   */
  loadGeneric(path: string, dataType: "image" | "text" | "arrayBuffer" | "blob", callback?: (data: HTMLImageElement | string | ArrayBuffer | Blob) => any) {
    let cachedResource = this.fetchCache.get(path);

    if (cachedResource) {
      return cachedResource;
    }

    let resource = new GenericResource({ viewer: this, handler: callback, fetchUrl: path });

    this.resources.push(resource);
    this.fetchCache.set(path, resource);

    this.registerEvents(resource);

    resource.emit('loadstart', resource);

    fetchDataType(path, dataType)
      .then((response) => {
        let data = response.data;

        if (response.ok) {
          if (callback) {
            data = callback(<HTMLImageElement | string | ArrayBuffer | Blob>data);

            if (data instanceof Promise) {
              data.then((data) => resource.loadData(data));
            } else {
              resource.loadData(data);
            }
          } else {
            resource.loadData(data);
          }
        } else {
          resource.error('FailedToFetch');

          this.emit('error', resource, response.error, data);
        }
      });

    return resource;
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
    let resource = new PromiseResource();

    this.registerEvents(resource);

    resource.promise();

    return resource;
  }

  /**
   * Wait for a group of resources to load.
   * If a callback is given, it will be called.
   * Otherwise a promise is returned.
   */
  whenLoaded(resources: Iterable<Resource>, callback?: (resources: Resource[]) => void) {
    let promises = [];

    for (let resource of resources) {
      // Only process actual resources.
      if (resource && resource.whenLoaded) {
        promises.push(<Promise<Resource>>resource.whenLoaded());
      }
    }

    let all = Promise.all(promises);

    if (callback) {
      all.then((loaded) => callback(loaded));
    } else {
      return all;
    }
  }

  /**
   * Wait for all of the resources to load.
   * 
   * If a callback is given, it will be called, otherwise, a promise is returned.
   */
  whenAllLoaded(callback?: (viewer: ModelViewer) => void) {
    let promise = new Promise((resolve: (viewer: ModelViewer) => void) => {
      if (this.resourcesLoading.size === 0) {
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
    this.renderOpaque();
    this.renderTranslucent();
  }

  /**
   * Render opaque things.
   */
  renderOpaque() {
    for (let scene of this.scenes) {
      scene.renderOpaque();
    }
  }

  /**
   * Render translucent things.
   */
  renderTranslucent() {
    for (let scene of this.scenes) {
      scene.renderTranslucent();
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

  registerEvents(resource: Resource) {
    ['loadstart', 'load', 'error', 'loadend'].map((e) => resource.once(e, (...data) => this.emit(e, ...data)));
  }

  baseTextureMapper(instance: ModelInstance) {
    let model = instance.model;
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
