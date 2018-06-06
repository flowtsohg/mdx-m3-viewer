import {createTextureAtlas} from '../common/canvas';
import EventDispatcher from './eventdispatcher';
import WebGL from './gl/gl';
import PromiseResource from './promiseresource';
import Scene from './scene';
import nativeTextureHandler from './handlers/nativetexture/handler';
import ImageTexture from './handlers/nativetexture/texture';

/**
 * A model viewer.
 */
export default class ModelViewer extends EventDispatcher {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {?Object} options
   */
  constructor(canvas, options) {
    super();

    this.eventDispatchCallback = (e) => this.dispatchEvent(e);

    /** @member {object} */
    this.resources = {
      array: [],
      map: new Map(),
    };

    /**
     * The speed of animation. Note that this is not the time of a frame in milliseconds, but rather the amount of animation frames to advance each update.
     * The speed of animation. Note that this is not the time of a frame in mill
     * @member {number}
     */
    this.frameTime = 1000 / 60;

    /** @member {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @member {WebGL} */
    this.webgl = new WebGL(canvas, options);

    /** @member {WebGLRenderingContext} */
    this.gl = this.webgl.gl;

    /** @member {Object<string, string>} */
    this.sharedShaders = {
      // Shared shader code to mimic gl_InstanceID
      'instanceId': `
                attribute float a_InstanceID;
            `,
      // Shared shader code to handle bone textures
      'boneTexture': `
                uniform sampler2D u_boneMap;
                uniform float u_vectorSize;
                uniform float u_rowSize;

                mat4 fetchMatrix(float column, float row) {
                    column *= u_vectorSize * 4.0;
                    row *= u_rowSize;
                    // Add in half texel to sample in the middle of the texel.
                    // Otherwise, since the sample is directly on the boundry, small floating point errors can cause the sample to get the wrong pixel.
                    // This is mostly noticable with NPOT textures, which the bone maps are.
                    column += 0.5 * u_vectorSize;
                    row += 0.5 * u_rowSize;

                    return mat4(texture2D(u_boneMap, vec2(column, row)),
                                texture2D(u_boneMap, vec2(column + u_vectorSize, row)),
                                texture2D(u_boneMap, vec2(column + u_vectorSize * 2.0, row)),
                                texture2D(u_boneMap, vec2(column + u_vectorSize * 3.0, row)));
                }
                `,
      // Shared shader code to handle decoding multiple bytes stored in floats
      'decodeFloat': `
                vec2 decodeFloat2(float f) {
                    vec2 v;

                    v[1] = floor(f / 256.0);
                    v[0] = floor(f - v[1] * 256.0);

                    return v;
                }

                vec3 decodeFloat3(float f) {
                    vec3 v;

                    v[2] = floor(f / 65536.0);
                    v[1] = floor((f - v[2] * 65536.0) / 256.0);
                    v[0] = floor(f - v[2] * 65536.0 - v[1] * 256.0);

                    return v;
                }
            `,
    };

    /** @member {Map<string, ShaderProgram>} */
    this.shaderMap = new Map();

    /** @member {Set<Object>} */
    this.handlers = new Set();

    /** @member {Array<Scene>} */
    this.scenes = [];

    /** @member {Set} */
    this.resourcesLoading = new Set();

    // Track when resources start loading.
    this.addEventListener('loadstart', (e) => {
      this.resourcesLoading.add(e.target);
    });

    // Track when resources end loading.
    this.addEventListener('loadend', (e) => {
      this.resourcesLoading.delete(e.target);

      // If there are currently no resources loading, dispatch the 'idle' event.
      if (this.resourcesLoading.size === 0) {
        // A timeout is used so that this event will arrive after the loadend event being processed.
        // Any nicer solution?
        setTimeout(() => this.dispatchEvent({type: 'idle'}), 0);
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
    this.batchSize = 256;

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

    /** @member {boolean} */
    this.audioEnabled = false;

    this.addHandler(nativeTextureHandler);
  }

  /**
   * Add an handler.
   *
   * @param {Object} handler
   * @return {boolean}
   */
  addHandler(handler) {
    let handlers = this.handlers;

    // Check to see if this handler was added already.
    if (!handlers.has(handler)) {
      if (handler.load && !handler.load(this)) {
        this.dispatchEvent({type: 'error', error: 'InvalidHandler', reason: 'FailedToLoad'});
        return false;
      }

      handlers.add(handler);

      return true;
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
        let resources = this.resources;
        let map = resources.map;
        let resource = map.get(src);

        if (resource) {
          return resource;
        }

        let handler = handlerAndDataType[0];

        resource = new handler.Constructor({viewer: this, handler, extension, pathSolver, fetchUrl: serverFetch ? src : ''});

        resources.array.push(resource);
        map.set(src, resource);

        this.registerEvents(resource);

        resource.dispatchEvent({type: 'loadstart'});

        if (serverFetch) {
          let dataType = handlerAndDataType[1];

          this.getData(src, dataType)
            .then((data) => {
              if (data) {
                try {
                  resource.loadData(data);
                } catch (e) {
                  resource.error('InvalidData', e);
                }
              } else {
                resource.error('FailedToFetch');
              }
            });
        } else {
          try {
            resource.loadData(src);
          } catch (e) {
            resource.error('InvalidData', e);
          }
        }

        return resource;
      } else {
        this.dispatchEvent({type: 'error', error: 'MissingHandler', reason: [src, extension, serverFetch]});

        return null;
      }
    }
  }

  /**
   * Returns a promise that will resolve with the data from the given path.
   * The data type determines the returned object:
   *     "image" => Image
   *     "text" => string
   *     "arrayBuffer" => ArrayBuffer
   *     "blob" => Blob
   *
   * @param {string} path
   * @param {string} dataType
   * @return {Promise}
   */
  async getData(path, dataType) {
    if (dataType === 'image') {
      // Promise wrapper for an image load.
      return await new Promise((resolve, reject) => {
        let image = new Image();

        image.onload = () => {
          resolve(image);
        };

        image.onerror = (e) => {
          this.dispatchEvent({type: 'error', error: 'ImageError', reason: e});
          resolve(null);
        };

        image.src = path;
      });
    }

    let response;

    // Fetch.
    try {
      response = await fetch(path);
    } catch (e) {
      this.dispatchEvent({type: 'error', error: 'NetworkError', reason: e});
      return;
    }

    // Fetch went ok?
    if (!response.ok) {
      this.dispatchEvent({type: 'error', error: 'HttpError', reason: response});
      return;
    }

    let data;

    // Try to get the requested data type.
    try {
      if (dataType === 'text') {
        data = await response.text();
      } else if (dataType === 'arrayBuffer') {
        data = await response.arrayBuffer();
      } else if (dataType === 'blob') {
        data = await response.blob();
      }
    } catch (e) {
      this.dispatchEvent({type: 'error', error: 'DataError', reason: e});
      return;
    }

    return data;
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
      let promise = this.makePromise();

      // When all of the textures are loaded, it's time to construct a texture atlas
      this.whenLoaded(textures)
        .then(() => {
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
  makePromise() {
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
      promises.push(resource.whenLoaded());
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
   * Remove a resource from the viewer.
   * Note that this only removes references to this resource, so your code should do the same, to allow GC to work.
   * This also means that if a resource is referenced by another resource, it is not going to be GC'd.
   * For example, removing  a texture that is being used by a model will not actually let GC collect it, until the model is deleted too, and loses all references.
   *
   * @param {Resource} resource
   * @return {boolean}
   */
  removeResource(resource) {
    let resources = this.resources;
    let map = resources.map;

    if (map.has(resource)) {
      resources.array.delete(resource);
      map.delete(resource);

      resource.detach();

      return true;
    }

    return false;
  }

  /**
   * Returns a promise that will be resolved with the canvas blob.
   *
   * @return {Promise}
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
    let scenes = this.scenes;
    let i;
    let l = scenes.length;

    // Render opaque things.
    for (i = 0; i < l; i++) {
      scenes[i].renderOpaque();
    }

    // Render translucent things.
    for (i = 0; i < l; i++) {
      scenes[i].renderTranslucent();
    }
  }

  /**
   * A shortcut to register the standard events to the given resource for the viewer, so as to forward events to the client.
   *
   * @param {Resource} resource
   */
  registerEvents(resource) {
    ['loadstart', 'load', 'error', 'loadend'].map((e) => resource.addEventListener(e, this.eventDispatchCallback));
  }
}
