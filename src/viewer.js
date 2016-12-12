/**
 * @class
 * @classdesc The main model viewer class. The starting point of your journey.
 * @extends EventDispatcher
 * @param {HTMLCanvasElement} canvas The canvas object that this model viewer should use.
 */
function ModelViewer(canvas) {
    EventDispatcher.call(this);

    /** @member {boolean} */
    this.paused = false;

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
     * @desc The speed of animation. Note that this is not the time of a frame in milliseconds, but rather the amount of animation frames to advance each update.
     * @member {number} 
     */
    this.frameTime = 1000 / 60;

    /** @member {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @member {WebGL} */
    this.webgl = new WebGL(canvas);

    /** @member {WebGLRenderingContext} */
    this.gl = this.webgl.gl;

    /** @member {object} */
    this.sharedShaders = {
        // Shared shader code to mimic gl_InstanceID
        "instanceId": `
            attribute float a_InstanceID;
        `,
        // Shared shader code to handle bone textures
        "boneTexture": `
            uniform sampler2D u_boneMap;
            uniform float u_vector_size;
            uniform float u_row_size;

            mat4 boneAtIndex(float column, float row) {
                float offset = column * u_vector_size * 4.0,
                rowOffset = row * u_row_size;

                return mat4(texture2D(u_boneMap, vec2(offset, rowOffset)), texture2D(u_boneMap, vec2(offset + u_vector_size, rowOffset)), texture2D(u_boneMap, vec2(offset + u_vector_size * 2.0, rowOffset)), texture2D(u_boneMap, vec2(offset + u_vector_size * 3.0, rowOffset)));
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

    /** @member {map.<string, Handler>} */
    this.handlers = new Map(); // Map from a file extension to an handler

    /** @member {scene} */
    this.scenes = [new Scene(this)];

    /** @member {number} */
    this.resourcesLoading = 0;
    this.addEventListener("loadstart", () => this.resourcesLoading += 1);
    this.addEventListener("loadend", () => this.resourcesLoading -= 1);

    // Main loop
    let step = () => { requestAnimationFrame(step); if (!this.paused) { this.updateAndRender(); } };
    step();
}

ModelViewer.prototype = {
    /**
     * @method
     * @desc Registers a new handler.
     * @param {Handler} handler The handler.
     * @returns this
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
     * @method
     * @desc Add a new scene to the viewer, and return it.
     * @returns {Scene}
     */
    addScene() {
        let scene = new Scene(this);

        this.scenes.push(scene);

        return scene;
    },

    /**
     * @method
     * @desc Load something. The meat of this whole project.
     *       If a single source was given, a single object will be returned. If an array was given, an array will be returned, with the same ordering.
     * @param {any|any[]} src The source used for the load.
     * @param {function} pathSolver The path solver used by this load, and any subsequent loads that are caused by it (for example, a model that loads its textures).
     * @see See more {@link LoadPathSolver here}.
     * @returns {AsyncResource|AsyncResource[]}
     */
    load(src, pathSolver) {
        if (Array.isArray(src)) {
            return src.map((single) => this.loadSingle(single, pathSolver));
        }

        return this.loadSingle(src, pathSolver);
    },

    /**
     * @method
     * @desc Calls the given callback, when all of the given resources finished loading. In the case all of the resources are already loaded, the call happens immediately.
     * @param {AsyncResource[]} resources The resources to wait for.
     * @param {function} callback The callback.
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

            if (this.isViewerResource(resource)) {
                resource.whenLoaded(gotLoaded);
            } else {
                wantLoaded -= 1;
            }
            
        }
    },

    /**
     * @method
     * @desc Calls the given callback, when all of the viewer resources finished loading. In the case all of the resources are already loaded, the call happens immediately.
     *       Note that instances are also counted.
     * @param {AsyncResource[]} resources The resources to wait for.
     * @param {function} callback The callback.
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
     * @method
     * @desc Deletes a resource from the viewer.
     *       Note that this only removes references to this resource, so your code should do the same, to allow GC to work.
     *       This also means that if a resource is referenced by another resource, it is not going to be GC'd.
     *       For example, deleting a texture that is being used by a model, will not actually let the GC to collect it, until the model is deleted too and loses all references.
     */
    delete(resource) {
        if (this.isViewerResource(resource)) {
            let objectType = resource.objectType,
                pair = this.pairFromType(objectType);

            // Find the resource in the array and splice it.
            pair.array.delete(resource);

            // Find the resource in the map and delete it.
            pair.map.deleteValue(resource);

            // This is a model, all of its views should be removed from their respective scenes.
            if (objectType === "model") {
                let modelViews = resource.views;

                for (let i = 0, l = modelViews.length; i < l; i++) {
                    // Detach the model view from its scene
                    modelViews[i].detach();
                }
            }
        }
    },

    /**
     * @method
     * @desc Checks if a given object is a resource of the viewer.
     *       This is done by checking the object's objectType field.
     * @param {object} object The object to check.
     * @returns {boolean}
     */
    isViewerResource(object) {
        if (object) {
            let objectType = object.objectType;

            return objectType === "model" || objectType === "texture" || objectType === "file";
        }

        return false;
    },

    /**
     * @method
     * @desc Remove all of the resources from this model viewer.
     */
    clear() {
        let resources = this.resources;

        for (let pair of [resources.models, resources.textures, resources.files]) {
            pair.array.length = 0;
            pair.map.clear();
        }

        for (let scene of this.scenes) {
            scene.clear();
        }
    },

    /**
     * @method
     * @desc Gets a Blob object representing the canvas, and calls the callback with it.
     * @param {function} callback The callback to call with the blob.
     */
    getRenderedAsBlob(callback) {
        // Must render to ensure that the internal canvas buffer is valid.
        this.render();
        this.canvas.toBlob((blob) => callback(blob));
    },

    /**
     * @method
     * @desc Gets an URL object representing the canvas, and calls the callback with it.
     * @param {function} callback The callback to call with the url.
     */
    getRenderedAsUrl(callback) {
        this.getRenderedAsBlob((blob) => {
            callback(URL.createObjectURL(blob));
        });
    },

    /**
     * @method
     * @desc Gets an Image object representing the canvas, and calls the callback with it.
     * @param {function} callback The callback to call with the image.
     */
    getRenderedAsImage(callback) {
        this.getRenderedAsUrl((url) => {
            let image = new Image();

            image.addEventListener("load", (e) => {
                callback(image);
            });

            image.src = url;
        });
    },

    /**
     * @method
     * @desc Update and render a frame.
     *       Used by the viewer's main loop, but can also be used for manual control when setting [paused]{@link ModelViewer#paused} to true.
     * @param {function} callback The callback to call with the image.
     */
    updateAndRender() {
        this.update();
        this.render();
    },

    // Load a single resource, called by load (possibly multiple times, if it was given an array).
    loadSingle(src, pathSolver) {
        if (src) {
            let extension,
                serverFetch;

            // Built-in texture source
            if (src instanceof HTMLImageElement || src instanceof HTMLVideoElement || src instanceof HTMLCanvasElement || src instanceof ImageData) {
                extension = ".png";
                serverFetch = false;
            } else {
                [src, extension, serverFetch] = pathSolver(src);
            }

            let handler = this.handlers.get(extension.toLowerCase());

            // Is there an handler for this file type?
            if (handler) {
                return this.loadResource(src, extension, serverFetch, pathSolver, handler);
            } else {
                this.dispatchEvent({ type: "error", error: "MissingHandler", extra: [src, extension, serverFetch] });
            }
        }
    },

    // Register the viewer to all of the standard events of a resource.
    registerEvents(resource) {
        let listener = (e) => this.dispatchEvent(e);

        ["loadstart", "load", "loadend", "error", "progress", "delete"].map(e => resource.addEventListener(e, listener));
    },

    // Used to easily get the resources object from an object type.
    pairFromType(objectType) {
        let resources = this.resources;

        if (objectType === "model" || objectType === "modelhandler") {
            return resources.models;
        } else if (objectType === "texture" || objectType === "texturehandler") {
            return resources.textures;
        } else if (objectType === "file" || objectType === "filehandler") {
            return resources.files;
        } else {
            throw new Error("NOPE");
        }
    },

    // The actual resource loader, called by loadSingle.
    loadResource(src, extension, serverFetch, pathSolver, handler) {
        let pair = this.pairFromType(handler.objectType),
            map = pair.map;

        // Only construct the resource if the source was not already loaded.
        if (!map.has(src)) {
            let resource = new handler.Constructor(this, pathSolver);

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
    },

    // Update. Duh.
    update() {
        let resources = this.resources,
            objects,
            i,
            l;

        objects = resources.models.array;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        objects = resources.textures.array;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        objects = resources.files.array;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }
    },

    // Render. Duh.
    render() {
        let scenes = this.scenes,
            gl = this.gl,
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

        this.dispatchEvent({ type: "render" })
    }
};

mix(ModelViewer.prototype, EventDispatcher.prototype);
