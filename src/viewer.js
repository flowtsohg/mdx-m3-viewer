/**
 * @class
 * @classdesc The main model viewer class. The starting point of your journey.
 * @extends EventDispatcher
 * @param {HTMLCanvasElement} canvas The canvas object that this model viewer should use.
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

    /** @member {number} */
    this.frameTimeMS = 1000 / 60;
    /** @member {number} */
    this.frameTimeS = 1 / 60;

    /** @member {map.<string, Handler>} */
    this.handlers = new Map(); // Map from a file extension to an handler

    /** @member {Camera} */
    this.camera = new Camera(Math.PI / 4, 1, 10, 100000);

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
            uniform float u_matrix_size;
            uniform float u_row_size;

            mat4 boneAtIndex(float column, float row) {
                float offset = column * u_matrix_size,
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

    // Initialize the viewport
    this.resetViewport();

    // Update the viewport when the window is resized
    window.addEventListener("resize", () => this.resetViewport());

    // Main loop
    let step = () => { requestAnimationFrame(step); this.update(); this.render(); };
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
                        for (let extension of extension) {
                            handlers.set(extension, handler);
                        }

                        return true;
                    } else {
                        this.dispatchEvent({ type: "error", error: "InvalidHandler", extra: "FailedToInitalize" });
                    }
                } else {
                    this.dispatchEvent({ type: "error", target: handler, error: "InvalidHandler", extra: "AlreadyAdded" });
                }
            }
        } else {
            this.dispatchEvent({ type: "error", error: "InvalidHandler", extra: "UnknownHandlerType" });
        }

        return false;
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
    whenAllLoaded(resources, callback) {
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
            }
            
        }
    },

    loadSingle(src, pathSolver) {
        if (src) {
            let extension, serverFetch;

            // Built-in texture source
            if (src instanceof HTMLImageElement || src instanceof HTMLVideoElement || src instanceof HTMLCanvasElement || src instanceof ImageData) {
                extension = ".png";
                serverFetch = false;
            } else {
                [src, extension, serverFetch] = pathSolver(src);
            }

            const handler = this.handlers.get(extension.toLowerCase());

            // Is there an handler for this file type?
            if (handler) {
                return this.loadResource(src, extension, serverFetch, pathSolver, handler);
            } else {
                this.dispatchEvent({ type: "error", error: "MissingHandler", extra: [src, extension, serverFetch] });
            }
        }
    },

    registerEvents(resource) {
        let listener = e => this.dispatchEvent(e);

        ["loadstart", "load", "loadend", "error", "progress", "delete"].map(e => resource.addEventListener(e, listener));
    },

    loadResource(src, extension, serverFetch, pathSolver, handler) {
        let allResources = this.resources,
            resources,
            constructor;

        // Model
        if (handler.objectType === "modelhandler") {
            resources = allResources.models;
            constructor = handler.Model;
        // Texture
        } else if (handler.objectType === "texturehandler") {
            resources = allResources.textures;
            constructor = handler.Texture;
        // File
        } else if (handler.objectType === "filehandler") {
            resources = allResources.files;
            constructor = handler.File;
        }

        const map = resources.map;

        if (!map.has(src)) {
            let resource = new constructor(this, pathSolver);

            map.set(src, resource);
            resources.array.push(resource);

            this.registerEvents(resource);

            this.dispatchEvent({ type: "loadstart", target: resource });

            resource.load(src, handler.binaryFormat, serverFetch);
        }

        return map.get(src);
    },

    /**
     * @method
     * @desc Deletes a resource from the viewer.
     *       Note that this only removes references to this resource, so your code should do the same, to allow GC to work.
     */
    delete (resource) {
        if (this.isViewerResource(resource)) {
            throw "IMPLEMENT ME";
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

            if (objectType) {
                return objectType === "model" || objectType === "texture" || objectType === "file";
            }
        }

        return false;
    },

    /**
     * @method
     * @desc Remove all of the resources from this model viewer.
     */
    clear() {
        const resources = this.resources;

        for (let objects of [resources.models, resources.textures, resources.files]) {
            objects.array.length = 0;
            objects.map.clear();
        }
    },

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

    render() {
        let gl = this.gl,
            models = this.resources.models.array,
            i,
            l = models.length;

        // See https://www.opengl.org/wiki/FAQ#Masking
        gl.depthMask(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (i = 0; i < l; i++) {
            models[i].renderViewsOpaque();
        }

        for (i = 0; i < l; i++) {
            models[i].renderViewsTranslucent();
        }

        for (i = 0; i < l; i++) {
            models[i].renderViewsEmitters();
        }

        this.dispatchEvent({ type: "render" })
    },

    resetViewport() {
        let canvas = this.canvas,
            width = canvas.clientWidth,
            height = canvas.clientHeight;

        canvas.width = width;
        canvas.height = height;

        this.gl.viewport(0, 0, width, height);

        this.camera.setViewport([0, 0, width, height]);
    }
};

mix(ModelViewer.prototype, EventDispatcher.prototype);
