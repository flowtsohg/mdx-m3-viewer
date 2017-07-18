/**
 * @constructor
 * @augments EventDispatcher
 * @param {HTMLCanvasElement} canvas
 */
function ModelViewer(canvas) {
    EventDispatcher.call(this);

    /** @member {object} */
    this.resources = {
        models: {
            array: [],
            map: new Map()
        },

        textures: {
            array: [],
            map: new Map()
        },

        files: {
            array: [],
            map: new Map()
        }
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
    this.webgl = new WebGL(canvas);

    /** @member {WebGLRenderingContext} */
    this.gl = this.webgl.gl;

    /** @member {Object<string, string>} */
    this.sharedShaders = {
        // Shared shader code to mimic gl_InstanceID
        "instanceId": `
            attribute float a_InstanceID;
        `,
        // Shared shader code to handle bone textures
        "boneTexture": `
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
        "decodeFloat": `
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

    /** @member {Map<string, Handler>} */
    this.handlers = new Map(); // Map from a file extension to an handler

    /** @member {Array<Scene>} */
    this.scenes = [];

    /** @member {number} */
    this.resourcesLoading = 0;
    this.addEventListener("loadstart", () => this.resourcesLoading += 1);
    this.addEventListener("loadend", () => this.resourcesLoading -= 1);
}

ModelViewer.prototype = {
    /**
     * Add an handler.
     * 
     * @param {Handler} handler The handler to add.
     * @returns {boolean}
     */
    addHandler(handler) {
        if (handler) {
            let objectType = handler.objectType;

            if (objectType === "modelhandler" || objectType === "texturehandler" || objectType === "filehandler") {
                let handlers = this.handlers,
                    extensions = handler.extension.split("|");

                // Check to see if this handler was added already.
                if (!handlers.has(extensions[0])) {
                    // Run the global initialization function of the handler.
                    // If it returns true, to signifiy everything worked correctly, add the handler to the handlers map.
                    if (handler.initialize(this)) {
                        // Add each of the handler's extensions to the handler map.
                        for (let extension of extensions) {
                            handlers.set(extension, handler);
                        }

                        return true;
                    } else {
                        this.dispatchEvent({ type: "error", error: "InvalidHandler", extra: "FailedToInitalize" });
                    }
                }
            } else {
                this.dispatchEvent({ type: "error", error: "InvalidHandler", extra: "UnknownHandlerType" });
            }
        }

        return false;
    },

    /**
     * Add a scene.
     * 
     * @param {Scene} scene The scene to add.
     * @returns {boolean}
     */
    addScene(scene) {
        if (scene && scene.objectType === "scene") {
            let scenes = this.scenes,
                index = scenes.indexOf(scene);

            if (index === -1) {
                scenes.push(scene);

                scene.env = this;

                return true;
            }
        }

        return false;
    },

    /**
     * Remove a scene.
     * 
     * @param {Scene} scene The scene to remove.
     * @returns {boolean}
     */
    removeScene(scene) {
        if (scene && scene.objectType === "scene") {
            let scenes = this.scenes,
                index = scenes.indexOf(scene);

            if (index !== -1) {
                scenes.splice(index, 1);

                scene.env = null;

                return true;
            }
        }

        return false;
    },

    /**
     * Removes all of the scenes in the viewer.
     */
    clear() {
        let scenes = this.scenes;

        for (let i = scenes.length; i--;) {
            this.removeScene(scenes[i]);
        }
    },

    /**
     * Get the rendering statistics of this scene.
     * This includes the following:
     *     renderedScenes
     *     renderedBuckets
     *     renderedInstances
     *     renderCalls
     *     renderedVertices
     *     renderedPolygons
     */
    getRenderStats() {
        let scenes = this.scenes,
            renderedScenes = scenes.length,
            renderedBuckets = 0,
            renderCalls = 0,
            renderedInstances = 0,
            renderedVertices = 0,
            renderedPolygons = 0;

        for (let i = 0; i < renderedScenes; i++) {
            let stats = scenes[i].getRenderStats();

            renderedBuckets += stats.renderedBuckets;
            renderCalls += stats.renderCalls;
            renderedInstances += stats.renderedInstances;
            renderedVertices += stats.renderedVertices;
            renderedPolygons += stats.renderedPolygons;
        }

        return { renderedScenes, renderedBuckets, renderCalls, renderedInstances, renderedVertices, renderedPolygons };
    },

    /**
     * Load something. The meat of this whole project.
     * 
     * @param {?} src The source used for the load.
     * @param {function(?)} pathSolver The path solver used by this load, and any subsequent loads that are caused by it (for example, a model that loads its textures).
     * @returns {AsyncResource}
     */
    load(src, pathSolver) {
        if (src) {
            let extension,
                serverFetch;

            // Built-in texture source
            if (src instanceof HTMLImageElement || src instanceof HTMLVideoElement || src instanceof HTMLCanvasElement || src instanceof ImageData || src instanceof WebGLTexture) {
                extension = ".png";
                serverFetch = false;
            } else {
                [src, extension, serverFetch] = pathSolver(src);
            }

            let handler = this.handlers.get(extension.toLowerCase());

            // Is there an handler for this file type?
            if (handler) {
                let pair = this.pairFromType(handler.objectType),
                    map = pair.map;
                
                // Only construct the resource if the source was not already loaded.
                if (!map.has(src)) {
                    let resource = new handler.Constructor(this, pathSolver);

                    resource.Handler = handler;

                    // Cache the resource
                    map.set(src, resource);
                    pair.array.push(resource);

                    // Register the standard events.
                    this.registerEvents(resource);

                    // Tell the resource to actually load itself
                    resource.load(src, handler.binaryFormat, serverFetch);
                }

                // Get the resource from the cache.
                return map.get(src);
            } else {
                this.dispatchEvent({ type: "error", error: "MissingHandler", extra: [src, extension, serverFetch] });
            }
        }
    },

    /**
     * A fake load.
     * This is needed for resources that know they are going to load internal resources, but don't yet know what they are.
     * So, in order to delay Viewer.whenAllLoaded() so it catches all internal resources, the resource can load fake place-holder resources.
     * 
     * @returns {PromiseResource}
     */
    makePromise() {
        let resource = new PromiseResource(this);

        this.registerEvents(resource);

        resource.load();

        return resource;
    },

    /**
     * Calls the given callback when all of the given resources finished loading. In the case all of the resources are already loaded, the call happens immediately.
     * 
     * @param {Array<AsyncResource>} resources The resources to wait for.
     * @param {function(Array<AsyncResource>)} callback The callback.
     */
    whenLoaded(resources, callback) {
        let loaded = 0,
            wantLoaded = resources.length;

        function gotLoaded() {
            loaded += 1;

            if (loaded === wantLoaded) {
                callback(resources);
            }
        }

        for (let i = 0; i < wantLoaded; i++) {
            let resource = resources[i];

            if (this.isResource(resource)) {
                resource.whenLoaded(gotLoaded);
            } else {
                wantLoaded -= 1;
            }
            
        }
    },

    /**
     * Calls the given callback when all of the viewer resources finished loading. In the case all of the resources are already loaded, the call happens immediately.
     * Note that instances are also counted.
     * 
     * @param {function(ModelViewer)} callback The callback.
     */
    whenAllLoaded(callback) {
        if (this.resourcesLoading === 0) {
            callback(this);
        } else {
            // Self removing listener
            let listener = () => { if (this.resourcesLoading === 0) { this.removeEventListener("loadend", listener); callback(this); } };

            this.addEventListener("loadend", listener);
        }
    },

    /**
     * Remove a resource from the viewer.
     * Note that this only removes references to this resource, so your code should do the same, to allow GC to work.
     * This also means that if a resource is referenced by another resource, it is not going to be GC'd.
     * For example, deleting a texture that is being used by a model will not actually let the GC to collect it, until the model is deleted too, and loses all references.
     * 
     * @param {AsyncResource} resource
     */
    removeResource(resource) {
        if (this.removeReference(resource)) {
            // Tell the resource to detach itself
            resource.detach();
        }
    },

    /**
     * Checks if a given object is a resource of the viewer.
     * This is done by checking the object's objectType field.
     * 
     * @param {*} object The object to check.
     * @returns {boolean}
     */
    isResource(object) {
        if (object) {
            let objectType = object.objectType;

            return objectType === "instance" || objectType === "model" || objectType === "texture" || objectType === "file";
        }

        return false;
    },

    /**
     * Gets a Blob object representing the canvas, and calls the callback with it.
     * 
     * @param {function(Blob)} callback The callback to call.
     */
    toBlob(callback) {
        this.canvas.toBlob((blob) => callback(blob));
    },

    /**
     * Update and render a frame.
     */
    updateAndRender() {
        this.update();
        this.render();
    },

    /**
     * Update.
     */
    update() {
        let resources = this.resources,
            objects;

        // Update all of the models.
        objects = resources.models.array;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        // Update all of the textures.
        objects = resources.textures.array;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        // Update all of the files.
        objects = resources.files.array;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        // Update all of the scenes.
        objects = this.scenes;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }
    },

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

        for (i = 0; i < l; i++) {
            scenes[i].renderOpaque();
        }

        for (i = 0; i < l; i++) {
            scenes[i].renderTranslucent();
        }

        for (i = 0; i < l; i++) {
            scenes[i].renderEmitters();
        }
    },

    // Removes the reference pair of this resource.
    removeReference(resource) {
        if (this.isResource(resource)) {
            let objectType = resource.objectType,
                pair = this.pairFromType(objectType);

            // Find the resource in the array and splice it.
            pair.array.delete(resource);

            // Find the resource in the map and delete it.
            pair.map.deleteValue(resource);

            return true;
        }

        return false;
    },

    // Register the viewer to all of the standard events of a resource.
    registerEvents(resource) {
        let listener = (e) => this.dispatchEvent(e);

        ["loadstart", "load", "loadend", "error", "progress"].map((e) => resource.addEventListener(e, listener));
    },

    // Used to easily get the resources object from an object type.
    pairFromType(objectType) {
        if (objectType === "model" || objectType === "modelhandler") {
            return this.resources.models;
        } else if (objectType === "texture" || objectType === "texturehandler") {
            return this.resources.textures;
        } else if (objectType === "file" || objectType === "filehandler") {
            return this.resources.files;
        }
    }
};

mix(ModelViewer.prototype, EventDispatcher.prototype);
