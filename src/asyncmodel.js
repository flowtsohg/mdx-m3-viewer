/**
 * Creates a new AsyncModel.
 *
 * @class The parent of {@link BaseModel}. Takes care of all the asynchronous aspects of loading models.
 * @name AsyncModel
 * @mixes Async
 * @param {string} source The source url that this model will be loaded from.
 * @param {number} id The id of this model.
 * @param {object} textureMap An object with texture path -> absolute urls mapping.
 */
function AsyncModel(source, fileType, pathSolver, isFromMemory, context) {
    this.type = "model";
    this.ready = false;
    this.fileType = fileType;
    this.id = generateID();
    this.pathSolver = pathSolver;
    this.context = context;
    this.isFromMemory = isFromMemory;
    this.source = source;
    this.instances = [];

    Async.call(this);
    EventDispatcher.call(this); 
}

AsyncModel.handlers = {};

AsyncModel.prototype = {
    loadstart: function () {
        this.dispatchEvent("loadstart");

        if (this.isFromMemory) {
            this.setupFromMemory(this.source);
        } else {
            this.request = getRequest(this.source, AsyncModel.handlers[this.fileType][1], this.setup.bind(this), this.error.bind(undefined, this), this.progress.bind(this));
        }
    },

    error: function (e) {
        this.dispatchEvent({ type: "error", error: e.target.status });
    },

    progress: function (e) {
        if (e.target.status === 200) {
            this.dispatchEvent({ type: "progress", loaded: e.loaded, total: e.total, lengthComputable: e.lengthComputable });
        }
    },

    abort: function () {
        if (this.request && this.request.readyState !== XMLHttpRequest.DONE) {
            this.request.abort();

            this.dispatchEvent("abort");
        }
    },
    
  /**
    * Setup a model once it finishes loading.
    *
    * @memberof AsyncModel
    * @instance
    * @param {object} textureMap An object with texture path -> absolute urls mapping.
    * @param {XMLHttpRequestProgressEvent} e The XHR event.
    */
    setup: function (e) {
        var status = e.target.status;
        
        if (status === 200) {
            this.setupFromMemory(e.target.response);
        } else {
            this.dispatchEvent({ type: "error", error: status });
            this.dispatchEvent("loadend");
        }
    },

    setupFromMemory: function (memory) {
        var model = new AsyncModel.handlers[this.fileType][0](this, memory);

        if (model.ready) {
            this.model = model;
            this.ready = true;

            this.runFunctors();

            this.dispatchEvent("load");
            this.dispatchEvent("loadend");
        }
    },
 
  /**
    * Request a model to setup a model instance.
    *
    * @memberof AsyncModel
    * @instance
    * @param {AsyncModelInstance} instance The requester.
    * @param {object} textureMap The requester's texture map.
    */
    setupInstance: function (instance) {
        if (this.ready) {
            this.instances.push(instance);

            instance.setup();
        } else {
            this.addFunctor("setupInstance", arguments);
        }
    },
  
  /**
    * Gets the name of a model.
    *
    * @memberof AsyncModel
    * @instance
    * @returns {string} The model's name.
    */
    getName: function () {
        if (this.ready) {
            return this.model.getName();
        }
    },

  /**
    * Gets the source that a model was loaded from.
    *
    * @memberof AsyncModel
    * @instance
    * @returns {string} The model's source.
    */
    getSource: function () {
        return this.source;
    },
  
  /**
    * Gets a model's attachment.
    *
    * @memberof AsyncModel
    * @instance
    * @param {number} id The id of the attachment.
    * @returns {Node} The attachment.
    */
    getAttachment: function (id) {
        if (this.ready) {
            return this.model.getAttachment(id);
        }
    },
  
  /**
    * Gets a model's camera.
    *
    * @memberof AsyncModel
    * @instance
    * @param {number} id The id of the camera.
    * @returns {Camera} The camera.
    */
    getCamera: function (id) {
        if (this.ready) {
            return this.model.getCamera(id);
        }
    },
  
  /**
    * Overrides a texture used by a model.
    *
    * @memberof AsyncModel
    * @instance
    * @param {string} path The texture path that gets overriden.
    * @paran {string} override The new absolute path that will be used.
    */
    overrideTexture: function (path, override) {
        if (this.ready) {
            this.model.overrideTexture(path, override);
        } else {
            this.addFunctor("overrideTexture", arguments);
        }
    },
  
  /**
    * Gets a model's texture map.
    *
    * @memberof AsyncModel
    * @instance
    * @returns {object} The texture map.
    */
    getTextureMap: function () {
        if (this.ready) {
            return this.model.getTextureMap();
        }
    },
  
  /**
    * Gets a model's sequences list.
    *
    * @memberof AsyncModel
    * @instance
    * @returns {array} The list of sequence names.
    */
    getSequences: function () {
        if (this.ready) {
            return this.model.getSequences();
        }
    },
  
  /**
    * Gets a model's attachments list.
    *
    * @memberof AsyncModel
    * @instance
    * @returns {array} The list of attachment names.
    */
    getAttachments: function () {
        if (this.ready) {
            return this.model.getAttachments();
        }
    },
  
  /**
    * Gets a model's bounding shapes list.
    *
    * @memberof AsyncModel
    * @instance
    * @returns {array} The list of bounding shape names.
    */
    getBoundingShapes: function () {
        if (this.ready) {
            return this.model.getBoundingShapes();
        }
    },
  
  /**
    * Gets a model's cameras list.
    *
    * @memberof AsyncModel
    * @instance
    * @returns {array} The list of camera names.
    */
    getCameras: function () {
        if (this.ready) {
            return this.model.getCameras();
        }
    },
  
  /**
    * Gets a model's number of meshes.
    *
    * @memberof AsyncModel
    * @instance
    * @returns {number} The number of meshes.
    */
    getMeshCount: function () {
        if (this.ready) {
            return this.model.getMeshCount();
        }
    },
  
    getPolygonCount: function () {
        if (this.ready) {
            return this.model.getPolygonCount();
        }
    }
};

mixin(Async.prototype, AsyncModel.prototype);
mixin(EventDispatcher.prototype, AsyncModel.prototype);
