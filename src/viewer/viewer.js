import EventEmitter from 'events';
import fetchDataType from '../common/fetchdatatype';
import mapequals from '../common/mapequals';
import WebGL from './gl/gl';
import PromiseResource from './promiseresource';
import Scene from './scene';
import imageTextureHandler from './handlers/imagetexture/handler';
import GenericResource from './genericresource';
import ClientBuffer from './gl/clientbuffer';
import ClientDataTexture from './gl/clientdatatexture';
import TextureMapper from './texturemapper';
import Texture from './texture';

/**
 * A model viewer.
 */
export default class ModelViewer extends EventEmitter {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {?Object} options
   */
  constructor(canvas, options) {
    super();

    /** @member {Array<Resource>} */
    this.resources = [];
    /** @member {Map<string, Resource>} */
    this.fetchCache = new Map();
    /** @member {Set<Resource>} */
    this.resourcesLoading = new Set();

    /** @member {Set<Object>} */
    this.handlers = new Set();

    /**
     * The speed of animation.
     * Note that this is not the time of a frame in milliseconds, but rather the amount of animation frames to advance each update.
     *
     * @member {number}
     */
    this.frameTime = 1000 / 60;

    /** @member {HTMLCanvasElement} */
    this.canvas = canvas;
    /** @member {WebGL} */
    this.webgl = new WebGL(canvas, options);
    /** @member {WebGLRenderingContext} */
    this.gl = this.webgl.gl;

    /** @member {Array<Scene>} */
    this.scenes = [];

    /** @member {number} */
    this.visibleCells = 0;
    /** @member {number} */
    this.visibleInstances = 0;
    /** @member {number} */
    this.updatedParticles = 0;

    /** @member {number} */
    this.frame = 0;

    let gl = this.gl;

    /**
     * A simple buffer containing the bytes [0, 1, 2, 0, 2, 3].
     * These are used as vertices in all geometry shaders.
     *
     * @member {WebGLBuffer}
     */
    this.rectBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    /**
     * A resizeable buffer that can be used by any part of the library.
     * The data it contains is temporary, and can be overwritten at any time.
     *
     * @member {ClientBuffer}
     */
    this.buffer = new ClientBuffer(gl);

    /**
     * A resizeable data texture that can be used by any part of the library.
     * The data it contains is temporary, and can be overwritten at any time.
     *
     * @member {ClientDataTexture}
     */
    this.dataTexture = new ClientDataTexture(gl);

    /**
     * A viewer-wide flag.
     * If it is false, not only will audio not run, but in fact audio files won't even be fetched in the first place.
     * If audio is desired, this should be set to true before loading models that use audio.
     *
     * @member {boolean}
     */
    this.enableAudio = false;

    /**
     * @member {Map<Model, TextureMapper}
     */
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
   * Add an handler.
   *
   * @param {Object} handler
   * @return {boolean}
   */
  addHandler(handler) {
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
   *
   * @return {Scene}
   */
  addScene() {
    let scene = new Scene(this);

    this.scenes.push(scene);

    return scene;
  }

  /**
   * Remove a scene.
   *
   * @param {Scene} scene The scene to remove.
   * @return {boolean}
   */
  removeScene(scene) {
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
   *
   * @param {string} ext
   * @return {?Object}
   */
  findHandler(ext) {
    for (let handler of this.handlers) {
      for (let extention of handler.extensions) {
        if (ext === extention[0]) {
          return [handler, extention[1]];
        }
      }
    }
  }

  /**
   * Load something. The meat of this whole project.
   *
   * @param {*} src The source used for the load.
   * @param {function(*)} pathSolver The path solver used by this load, and any subsequent loads that are caused by it (for example, a model that loads its textures).
   * @param {?Object} solverParams An optional object containing parameters to be passed to the path solver.
   * @return {?Resource}
   */
  load(src, pathSolver, solverParams) {
    if (src) {
      let extension;
      let serverFetch;

      // Built-in texture source
      if ((src instanceof HTMLImageElement) || (src instanceof HTMLVideoElement) || (src instanceof HTMLCanvasElement) || (src instanceof ImageData) || (src instanceof WebGLTexture)) {
        extension = '.png';
        serverFetch = false;
        pathSolver = null;
      } else {
        [src, extension, serverFetch] = pathSolver(src, solverParams);
      }

      let handlerAndDataType = this.findHandler(extension.toLowerCase());

      // Is there an handler for this file type?
      if (handlerAndDataType) {
        if (serverFetch) {
          let resource = this.fetchCache.get(src);

          if (resource) {
            return resource;
          }
        }

        let handler = handlerAndDataType[0];
        let resource = new handler.Constructor({viewer: this, handler, extension, pathSolver, fetchUrl: serverFetch ? src : ''});

        this.resources.push(resource);

        if (serverFetch) {
          this.fetchCache.set(src, resource);
        }

        this.registerEvents(resource);

        resource.emit('loadstart', resource);

        if (serverFetch) {
          let dataType = handlerAndDataType[1];

          fetchDataType(src, dataType)
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
          resource.loadData(src);
        }

        return resource;
      } else {
        this.emit('error', this, 'MissingHandler', [src, extension, serverFetch]);

        return null;
      }
    }
  }

  /**
   * Check whether the given string maps to a resource in the cache.
   *
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return this.fetchCache.has(key);
  }

  /**
   * Get a resource from the cache.
   *
   * @param {string} key
   * @return {?Resource}
   */
  get(key) {
    return this.fetchCache.get(key);
  }

  /**
   * Load a resource generically.
   * Unlike load(), this does not use handlers or construct any internal objects.
   * If no callback is given, the resource's data is the fetch data.
   * If a callback is given, the resource's data is the value returned by it when called with the fetch data.
   * If a callback returns a promise, the resource's data will be the result of the promise.
   *
   * @param {string} path
   * @param {string} dataType
   * @param {?function} callback
   * @return {GenericResource}
   */
  loadGeneric(path, dataType, callback) {
    let resource = this.fetchCache.get(path);

    if (resource) {
      return resource;
    }

    resource = new GenericResource({viewer: this, handler: callback, fetchUrl: path});

    this.resources.push(resource);
    this.fetchCache.set(path, resource);

    this.registerEvents(resource);

    resource.emit('loadstart', resource);

    fetchDataType(path, dataType)
      .then((response) => {
        let data = response.data;

        if (response.ok) {
          if (callback) {
            data = callback(data);

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
   *
   * @param {Resource} resource
   * @return {boolean}
   */
  unload(resource) {
    let fetchCache;
    let fetchUrl = resource.fetchUrl;

    if (fetchUrl !== '') {
      fetchCache.delete(fetchUrl);
    }

    let resources = this.resources;
    let index = resources.indexOf(resource);

    if (index !== -1) {
      resource.splice(index, 1);

      return true;
    }

    return false;
  }

  /**
   * Starts loading a new empty resource, and returns it.
   * This empty resource will block the "idle" event (and thus whenAllLoaded) until it's resolved.
   * This is used when a resource might get loaded in the future, but it is not known what it is yet.
   *
   * @return {PromiseResource}
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
   *
   * @param {Iterable<Resource>} resources
   * @param {?function} callback
   * @return {?Promise}
   */
  whenLoaded(resources, callback) {
    let promises = [];

    for (let resource of resources) {
      // Only process actual resources.
      if (resource && resource.whenLoaded) {
        promises.push(resource.whenLoaded());
      }
    }

    let all = Promise.all(promises);

    if (callback) {
      all.then(() => callback(promises));
    } else {
      return all;
    }
  }

  /**
   * Wait for all of the resources to load.
   * If a callback is given, it will be called.
   * Otherwise, a promise is returned.
   *
   * @param {?function} callback
   * @return {?Promise}
   */
  whenAllLoaded(callback) {
    let promise = new Promise((resolve, reject) => {
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
   * If a callback is given, it will be called.
   * Otherwise, a promise is returned.
   *
   * @param {?function} callback
   * @return {?Promise<Blob>}
   */
  toBlob(callback) {
    let promise = new Promise((resolve) => this.canvas.toBlob((blob) => resolve(blob)));

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
   * Called automatically by updateAndRender().
   * Call this at some point before render() if you need more control.
   */
  startFrame() {
    let gl = this.gl;

    // See https://www.opengl.org/wiki/FAQ#Masking
    gl.depthMask(1);
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
   * A shortcut to register the standard events to the given resource for the viewer, so as to forward events to the client.
   *
   * @param {Resource} resource
   */
  registerEvents(resource) {
    ['loadstart', 'load', 'error', 'loadend'].map((e) => resource.once(e, (...data) => this.emit(e, ...data)));
  }

  /**
   * Clear all of the emitted objects in this viewer.
   */
  clearEmittedObjects() {
    for (let scene of this.scenes) {
      scene.clearEmittedObjects();
    }
  }

  /**
   * @param {ModelInstance} instance
   * @return {TextureMapper}
   */
  baseTextureMapper(instance) {
    let model = instance.model;
    let textureMappers = this.textureMappers;

    if (!textureMappers.has(model)) {
      textureMappers.set(model, []);
    }

    let mappers = textureMappers.get(model);

    if (!mappers.length) {
      mappers[0] = new TextureMapper(model);
    }

    return mappers[0];
  }

  /**
   * @param {ModelInstance} instance
   * @param {*} key
   * @param {?Texture} texture
   * @return {TextureMapper}
   */
  changeTextureMapper(instance, key, texture) {
    let map = new Map(instance.textureMapper.textures);

    if (texture instanceof Texture) {
      map.set(key, texture);
    } else {
      map.delete(key);
    }

    let model = instance.model;
    let mappers = this.textureMappers.get(model);

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
