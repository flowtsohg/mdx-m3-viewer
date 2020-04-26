import { EventEmitter } from 'events';
import { FetchDataTypeName, FetchDataType, FetchResult, fetchDataType } from '../common/fetchdatatype';
import mapequals from '../common/mapequals';
import WebGL from './gl/gl';
import PromiseResource from './promiseresource';
import Scene from './scene';
import { Resource } from './resource';
import { PathSolver, HandlerResourceData, HandlerResource } from './handlerresource';
import GenericResource from './genericresource';
import ClientBuffer from './gl/clientbuffer';
import Model from './model';
import ModelInstance from './modelinstance';
import TextureMapper from './texturemapper';
import Texture from './texture';
import { isImageSource, isImageExtension, ImageTexture } from './imagetexture';
import CubeMap from './cubemap';

/**
 * The minimal structure of handlers.
 * 
 * Additional data can be added to them for the purposes of the implementation.
 */
export interface Handler {
  extensions: string[][];
  load?: (viewer: ModelViewer) => boolean;
  resource: new (resourceData: HandlerResourceData) => HandlerResource
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
  resourcesLoading: Set<Resource> = new Set();
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
        // Check if the handler has a loader, and if so load it.
        if (handler.load && !handler.load(this)) {
          this.emit('error', this, `The handler's load function failed`, handler);
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
   * If `src` is an image texture source (e.g. an image or a canvas), it will be loaded directly.
   * 
   * Otherwise, `pathSolver` is called with `src` and `solverParams`, and must return an array of values:
   * 
   *     [finalSrc, extension, isFetch]
   *
   * If `finalSrc` is an image texture source, it will be loaded directly.
   * 
   * If `extension` is an image texture source extension (.png/.jpg/.gif), it will be fetched and loaded directly.
   * 
   * Otherwise, `extension` is used to select the handler.\
   * If `isFetch` is true, `finalSrc` is the url from which to fetch.\
   * If `isFetch` is false, `finalSrc` is whatever the handler expects, typically an ArrayBuffer or a string.
   * 
   * If the resource being loaded has internal resources (e.g. a model that loads its own textures), `pathSolver` will be called for them as well.
   * 
   * A resource is always returned, except for when `pathSolver` isn't given but `src` isn't an image texture source, or when the handler couldn't be resolved.
   */
  load(src: any, pathSolver?: PathSolver, solverParams?: any) {
    // If given an image texture source, load an image texture directly.
    if (isImageSource(src)) {
      return this.loadImageTexture(() => [src])
    }

    // Resolve the load.
    if (pathSolver) {
      let [finalSrc, extension, isFetch] = pathSolver(src, solverParams);

      if (typeof extension !== 'string') {
        this.emit('error', this, 'The path solver did not return an extension', pathSolver);

        return;
      }
      // Allow path solvers to use both ".ext" and "ext".
      if (extension[0] !== '.') {
        extension = '.' + extension;
      }

      // If the path solver returns an image texture source, load an image texture directly.
      if (isImageSource(finalSrc)) {
        return this.loadImageTexture(() => [finalSrc]);
      }

      // If the path solver wants to fetch an image texture source, load an image texture directly, but also cache the texture.
      if (isImageExtension(extension)) {
        let texture = this.fetchCache.get(finalSrc);

        if (texture) {
          return texture;
        }

        texture = this.loadImageTexture(() => [finalSrc]);

        this.fetchCache.set(finalSrc, texture);

        return texture;
      }

      let handlerAndDataType = this.findHandler(extension.toLowerCase());

      // Is there an handler for this file type?
      if (handlerAndDataType) {
        if (isFetch) {
          let resource = this.fetchCache.get(finalSrc);

          if (resource) {
            return <HandlerResource>resource;
          }
        }

        let handler = <Handler>handlerAndDataType[0];
        let resource = new handler.resource({ viewer: this, extension, pathSolver, fetchUrl: isFetch ? finalSrc : '' });

        this.resources.push(resource);

        if (isFetch) {
          this.fetchCache.set(finalSrc, resource);
        }

        this.registerEvents(resource);

        resource.emit('loadstart', resource);

        if (isFetch) {
          let dataType = <FetchDataTypeName>handlerAndDataType[1];

          fetchDataType(finalSrc, dataType)
            .then((response) => {
              let data = response.data;

              if (response.ok) {
                resource.loadData(data);
              } else {
                resource.error(<string>response.error, data);
              }
            });
        } else {
          resource.loadData(finalSrc);
        }

        return resource;
      } else {
        this.emit('error', this, `Unknown extension "${extension}" for "${src}". Did you forget to add the handler?`);
      }
    } else {
      this.emit('error', this, `Could not resolve "${src}". Did you forget to pass a path solver?`);
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
  loadGeneric(path: string, dataType: FetchDataTypeName, callback?: (data: FetchDataType) => any) {
    let cachedResource = this.fetchCache.get(path);

    if (cachedResource) {
      // Technically also non-generic resources can be returned here, since the fetch cache is shared.
      // That being said, this should be used for generic resources, and it makes the typing a lot easier.
      return <GenericResource>cachedResource;
    }

    let resource = new GenericResource({ viewer: this, fetchUrl: path });

    this.resources.push(resource);
    this.fetchCache.set(path, resource);

    this.registerEvents(resource);

    resource.emit('loadstart', resource);

    fetchDataType(path, dataType)
      .then((response: FetchResult) => {
        let data = response.data;

        if (response.ok) {
          if (callback) {
            try {
              data = callback(<FetchDataType>data);
            } catch (e) {
              resource.emit('error', 'An exception was thrown while running the client callback', e);
            }

            if (data instanceof Promise) {
              data.then((data) => resource.loadData(data));
            } else {
              resource.loadData(data);
            }
          } else {
            resource.loadData(data);
          }
        } else {
          resource.error(<string>response.error, data);
        }
      });

    return resource;
  }

  /**
   * Load an image texture.
   * 
   * `pathSolver` must return an array of values like all path solvers.\
   * If the first array element is an image texture source, it will be used.\
   * Otherwise, it will always try to fetch an image.\
   * Any other array elements are ignored.
   * 
   * Note that this is usually called by the viewer itself.\
   * For example, if you want to load an image directly, the following is recommended:
   * 
   *     viewer.load(image)
   */
  loadImageTexture(pathSolver: PathSolver) {
    let texture = new ImageTexture({ viewer: this, pathSolver });

    this.resources.push(texture);

    this.registerEvents(texture);

    texture.emit('loadstart', texture);

    let finalSrc = <string | TexImageSource>pathSolver(undefined)[0];

    if (!isImageSource(finalSrc)) {
      let path = <string>finalSrc;

      texture.extension = path.slice(path.lastIndexOf('.'));
      texture.fetchUrl = path;

      fetchDataType(path, 'image')
        .then((response: FetchResult) => {
          let data = response.data;

          if (response.ok) {
            texture.loadData(data);
          } else {
            texture.error(<string>response.error, data);
          }
        });
    } else {
      texture.loadData(finalSrc);
    }

    return texture;
  }

  /**
   * Load a cube map texture.
   * 
   * `pathSolver` will be called 6 times, each time with a number refering to one of the textures:
   * 
   *     0 = Positive X
   *     1 = Negative X
   *     2 = Positive Y
   *     3 = Negative Y
   *     4 = Positive Z
   *     5 = Negative Z
   * 
   * `pathSolver` must return an array of values like all path solvers.\
   * If the first array element is an image texture source, it will be used.\
   * Otherwise, it will always try to fetch an image.\
   * Any other array elements are ignored.
   */
  loadCubeMap(pathSolver: PathSolver) {
    let cubeMap = new CubeMap({ viewer: this, pathSolver });

    this.resources.push(cubeMap);

    this.registerEvents(cubeMap);

    cubeMap.emit('loadstart', cubeMap);

    let fetchPromises: Promise<FetchResult>[] = [];

    for (let i = 0; i < 6; i++) {
      let finalSrc = pathSolver(i)[0];

      if (isImageSource(finalSrc)) {
        fetchPromises[i] = new Promise((resolve) => resolve({ ok: true, data: finalSrc }));
      } else {
        fetchPromises[i] = fetchDataType(finalSrc, 'image');
      }
    }

    Promise.all(fetchPromises)
      .then((fetchResults) => {
        let planes = [];

        for (let i = 0; i < 6; i++) {
          let result = fetchResults[i];

          if (result.ok) {
            planes[i] = result.data;
          } else {
            cubeMap.error(<string>result.error, result.data);

            return;
          }
        }

        cubeMap.loadData(planes);
      });

    return cubeMap;
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
    let resource = new PromiseResource({ viewer: this });

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
      if (resource instanceof Resource) {
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

  registerEvents(resource: Resource) {
    ['loadstart', 'load', 'error', 'loadend'].map((e) => resource.once(e, (...data) => this.emit(e, ...data)));
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
