import { createTextureAtlas } from '../common/canvas';
import EventDispatcher from './eventdispatcher';
import WebGL from './gl/gl';
import Resource from './resource';
import PromiseResource from './promiseresource';
import Scene from './scene';

export default class ModelViewer extends EventDispatcher {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {?Object} options
     */
    constructor(canvas, options) {
        super();

        /** @member {object} */
        this.resources = {
            array: [],
            map: new Map()
        };

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
            `
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
                setTimeout(() => this.dispatchEvent({ type: 'idle' }), 0);
            }
        });

        this.noCulling = false; // Set to true to disable culling viewer-wide.

        this.textureAtlases = {};

        this.batchSize = 256; // The size of instances batched per bucket.

        this.renderedInstances = 0;
        this.renderedParticles = 0;
        this.renderedBuckets = 0;
        this.renderedScenes = 0;
        this.renderCalls = 0;
    }

    /**
     * Add an handler.
     * 
     * @param {Object} handler
     * @returns {boolean}
     */
    addHandler(handler) {
        let handlers = this.handlers,
            extensions = handler.extensions;

        // Check to see if this handler was added already.
        if (!handlers.has(handler)) {
            if (handler.load && !handler.load(this)) {
                this.dispatchEvent({ type: 'error', error: 'InvalidHandler', reason: 'FailedToLoad' });
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
     * @returns {Scene}
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
     * @returns {boolean}
     */
    removeScene(scene) {
        let scenes = this.scenes,
            index = scenes.indexOf(scene);

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
     * @returns {Resource}
     */
    load(src, pathSolver) {
        if (src) {
            let extension,
                serverFetch;

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
                let resources = this.resources,
                    map = resources.map,
                    resource = map.get(src);

                if (resource) {
                    return resource;
                }

                let handler = handlerAndDataType[0];

                resource = new handler.constructor({ viewer: this, handler, extension, pathSolver, fetchUrl: serverFetch ? src : '' });

                resources.array.push(resource);
                map.set(src, resource);

                this.registerEvents(resource);

                resource.dispatchEvent({ type: 'loadstart' });

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
                        })
                } else {
                    try {
                        resource.loadData(src);
                    } catch (e) {
                        resource.error('InvalidData', e);
                    }
                }

                return resource;
            } else {
                this.dispatchEvent({ type: 'error', error: 'MissingHandler', reason: [src, extension, serverFetch] });

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
     */
    async getData(path, dataType) {
        if (dataType === 'image') {
            // Promise wrapper for an image load.
            let image = await new Promise((resolve, reject) => {
                let image = new Image();
    
                image.onload = () => {
                    resolve(image);
                };
    
                image.onerror = (e) => {
                    this.dispatchEvent({ type: 'error', error: 'ImageError', reason: e });
                    resolve(null);
                };
    
                image.src = path;
            });

            return image;
        }

        let response;

        // Fetch.
        try {
            response = await fetch(path);
        } catch (e) {
            this.dispatchEvent({ type: 'error', error: 'NetworkError', reason: e });
            return;
        }

        // Fetch went ok?
        if (!response.ok) {
            this.dispatchEvent({ type: 'error', error: 'HttpError', reason: response });
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
            this.dispatchEvent({ type: 'error', error: 'DataError', reason: e });
            return;
        }

        return data;
    }

    loadShader(name, vertex, fragment) {
        let map = this.shaderMap;

        if (!map.has(name)) {
            map.set(name, this.webgl.createShaderProgram(vertex, fragment));
        }

        return map.get(name);
    }

    async loadTextureAtlas(name, textures) {
        let textureAtlases = this.textureAtlases;

        if (textureAtlases[name]) {
            return textureAtlases[name];
        }

        // Promise that there is a future load that the code cannot know about yet, so whenAllLoaded() isn't called prematurely.
        let promise = this.makePromise();

        // When all of the textures are loaded, it's time to construct a texture atlas
        await this.whenLoaded(textures);

        // In case multiple models are loaded quickly, and this is called before the textures finished loading, this will stop multiple atlases from being created.
        if (textureAtlases[name]) {
            // Resolve the promise.
            promise.resolve();

            return textureAtlases[name];
        } else {
            let atlasData = createTextureAtlas(textures.map((texture) => texture.imageData)),
                atlas = { texture: this.load(atlasData.imageData), columns: atlasData.columns, rows: atlasData.rows };

            textureAtlases[name] = atlas;

            // Resolve the promise.
            promise.resolve();

            return atlas;
        }
    }

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
     * @returns {PromiseResource}
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
     * @returns {Promise}
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
     * @returns {Promise}
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
     * @param {AsyncResource} resource
     */
    removeResource(resource) {
        let resources = this.resources,
            map = resources.map;

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
     * @returns {Promise} 
     */
    toBlob() {
        return new Promise((resolve) => this.canvas.toBlob((blob) => resolve(blob)));
    }

    /**
     * Update and render a frame.
     */
    updateAndRender() {
        this.update();
        this.render();
    }

    /**
     * Update.
     */
    update() {
        let resources = this.resources.array,
            scenes = this.scenes;

        // Update all of the resources.
        //for (let i = 0, l = resources.length; i < l; i++) {
            //resources[i].update();
        //}

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
     * Render.
     */
    render() {
        let gl = this.gl,
            scenes = this.scenes,
            i,
            l = scenes.length;

        // See https://www.opengl.org/wiki/FAQ#Masking
        gl.depthMask(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Render opaque things.
        for (i = 0; i < l; i++) {
            scenes[i].renderOpaque(gl);
        }

        // Render translucent things.
        for (i = 0; i < l; i++) {
            scenes[i].renderTranslucent(gl);
        }
    }

    // Propagate the standard events.
    registerEvents(resource) {
        let listener = (e) => this.dispatchEvent(e);

        ['loadstart', 'load', 'error', 'loadend'].map((e) => resource.addEventListener(e, listener));
    }
};
