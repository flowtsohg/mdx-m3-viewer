import EventEmitter from 'events';
import {createTextureAtlas} from '../common/canvas';
import fetchDataType from '../common/fetchdatatype';
import WebGL from './gl/gl';
import PromiseResource from './promiseresource';
import Scene from './scene';
import imageTextureHandler from './handlers/imagetexture/handler';
import ImageTexture from './handlers/imagetexture/texture';
import GenericResource from './genericresource';

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

    /** @member {Map<string, Resource>} */
    this.resourcesMap = new Map();

    /** @member {Array<Resource>} */
    this.resources = [];

    /**
     * The speed of animation. Note that this is not the time of a frame in milliseconds, but rather the amount of animation frames to advance each update.
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

    /** @member {Map<string, ShaderProgram>} */
    this.shaderMap = new Map();

    /** @member {Set<Object>} */
    this.handlers = new Set();

    /** @member {Array<Scene>} */
    this.scenes = [];

    /** @member {Set} */
    this.resourcesLoading = new Set();

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
        // Any nicer solution?
        setTimeout(() => this.emit('idle'), 0);
      }
    });

    this.noCulling = false; // Set to true to disable culling viewer-wide.
    this.noUpdating = false;

    this.textureAtlases = {};

    /**
     * The number of instances that a bucket should be able to contain.
     *
     * @member {number}
     */
    this.batchSize = 8;

    /** @member {number} */
    this.renderedInstances = 0;
    /** @member {number} */
    this.renderedParticles = 0;
    /** @member {number} */
    this.renderedBuckets = 0;
    /** @member {number} */
    this.renderedScenes = 0;
    /** @member {number} */
    this.renderCalls = 0;

    /**
     * A viewer-wide flag.
     * If it is false, not only will audio not run, but in fact audio files won't even be fetched in the first place.
     * If audio is desired, this should be set to true before loading models that use audio.
     *
     * @member {boolean}
     */
    this.enableAudio = false;

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
    let scenes = this.scenes;

    for (let i = scenes.length; i--;) {
      this.removeScene(scenes[i]);
    }
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
   * @param {?} src The source used for the load.
   * @param {function(?)} pathSolver The path solver used by this load, and any subsequent loads that are caused by it (for example, a model that loads its textures).
   * @return {Resource}
   */
  load(src, pathSolver) {
    if (src) {
      let extension;
      let serverFetch;

      // Built-in texture source
      if ((src instanceof HTMLImageElement) || (src instanceof HTMLVideoElement) || (src instanceof HTMLCanvasElement) || (src instanceof ImageData) || (src instanceof WebGLTexture)) {
        extension = '.png';
        serverFetch = false;
        pathSolver = null;
      } else {
        [src, extension, serverFetch] = pathSolver(src);
      }

      let handlerAndDataType = this.findHandler(extension.toLowerCase());

      // Is there an handler for this file type?
      if (handlerAndDataType) {
        let resource = this.resourcesMap.get(src);

        if (resource) {
          return resource;
        }

        let handler = handlerAndDataType[0];

        resource = new handler.Constructor({viewer: this, handler, extension, pathSolver, fetchUrl: serverFetch ? src : ''});

        this.resources.push(resource);
        this.resourcesMap.set(src, resource);

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
   * Check whether the given key maps to a resource in the cache.
   *
   * @param {*} key
   * @return {boolean}
   */
  exists(key) {
    return this.resourcesMap.has(key);
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
    let resource = this.resourcesMap.get(path);

    if (resource) {
      return resource;
    }

    resource = new GenericResource({viewer: this, handler: callback, fetchUrl: path});

    this.resources.push(resource);
    this.resourcesMap.set(path, resource);

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
    // Loop over all of the values and find this resource.
    // This is needed to support unloading in-memory resources that will have no fetchUrl.
    for (let [key, value] of this.resourcesMap) {
      if (value === resource) {
        this.resourcesMap.delete(key);
        this.resources.splice(this.resources.indexOf(resource), 1);

        return true;
      }
    }

    return false;
  }

  /**
   * Load and cache a shader in the viewer.
   *
   * @param {string} name
   * @param {string} vertex
   * @param {string} fragment
   * @return {ShaderProgram}
   */
  loadShader(name, vertex, fragment) {
    let map = this.shaderMap;

    if (!map.has(name)) {
      map.set(name, this.webgl.createShaderProgram(vertex, fragment));
    }

    return map.get(name);
  }

  /**
   * Load a texture atlas and cache it in the viewer.
   * The atlas is made from an array (or any iterable object) of textures.
   *
   * @param {string} name
   * @param {Iterable<Texture>} textures
   * @return {ImageTexture}
   */
  loadTextureAtlas(name, textures) {
    let textureAtlases = this.textureAtlases;

    if (!textureAtlases[name]) {
      let textureAtlas = {texture: new ImageTexture({viewer: this}), columns: 0, rows: 0};

      // Promise that there is a future load that the code cannot know about yet, so whenAllLoaded() isn't called prematurely.
      let promise = this.promise();

      // When all of the textures are loaded, it's time to construct a texture atlas
      this.whenLoaded(textures)
        .then((textures) => {
          for (let texture of textures) {
            // If a texture failed to load, don't create the atlas.
            if (!texture.ok) {
              // Resolve the promise.
              promise.resolve();

              return;
            }
          }

          let atlasData = createTextureAtlas(textures.map((texture) => texture.imageData));

          textureAtlas.texture.loadData(atlasData.imageData);
          textureAtlas.columns = atlasData.columns;
          textureAtlas.rows = atlasData.rows;

          // Resolve the promise.
          promise.resolve();
        });

      textureAtlases[name] = textureAtlas;
    }

    return textureAtlases[name];
  }

  /**
   * Returns the texture part of a texture atlas, or null if it doesn't exist.
   *
   * @param {string} name
   * @return {Texture|null}
   */
  getTextureAtlas(name) {
    let atlas = this.textureAtlases[name];

    if (atlas) {
      return atlas.texture;
    }

    return null;
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
   * Returns a promise that will be resolved once all of the given resources get loaded.
   * The promise will resolve instantly if they are already loaded.
   *
   * @param {Iterable<Resource>} resources The resources to wait for.
   * @return {Promise}
   */
  whenLoaded(resources) {
    let promises = [];

    for (let resource of resources) {
      // Only process actual resources.
      if (resource && resource.whenLoaded) {
        promises.push(resource.whenLoaded());
      }
    }

    return Promise.all(promises);
  }

  /**
   * Returns a promise that will be resolved once all of the currently loading resources get loaded.
   * The promise will resolve instantly if nothing is being loaded.
   *
   * @return {Promise}
   */
  whenAllLoaded() {
    return new Promise((resolve, reject) => {
      if (this.resourcesLoading.size === 0) {
        resolve(this);
      } else {
        this.once('idle', () => resolve(this));
      }
    });
  }

  /**
   * Returns a promise that will be resolved with the canvas blob.
   *
   * @return {Promise<Blob>}
   */
  toBlob() {
    return new Promise((resolve) => this.canvas.toBlob((blob) => resolve(blob)));
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
   * Update.
   */
  update() {
    let scenes = this.scenes;

    this.renderedInstances = 0;
    this.renderedParticles = 0;
    this.renderedBuckets = 0;
    this.renderedScenes = 0;
    this.renderCalls = 0;

    // Update all of the scenes.
    for (let i = 0, l = scenes.length; i < l; i++) {
      let scene = scenes[i];

      if (scene.rendered) {
        scene.update();

        this.renderedInstances += scene.renderedInstances;
        this.renderedParticles += scene.renderedParticles;
        this.renderedBuckets += scene.renderedBuckets;
        this.renderedScenes += 1;
        this.renderCalls += scene.renderCalls;
      }
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
    ['loadstart', 'load', 'error', 'loadend'].map((e) => resource.on(e, (...data) => this.emit(e, ...data)));
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
