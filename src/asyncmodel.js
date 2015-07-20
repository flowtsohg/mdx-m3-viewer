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
function AsyncModel(source, fileType, customPaths, isFromMemory, context) {
    var callbacks = context.callbacks;
    
    this.type = "model";
    this.ready = false;
    this.fileType = fileType;
    this.id = generateID();
    this.customPaths = customPaths;

    // All the instances owned by this model
    this.instances = [];

    Async.call(this);

    this.context = context;

    this.onerror = callbacks.onerror;
    this.onprogress = callbacks.onprogress;
    this.onload = callbacks.onload;

    callbacks.onloadstart(this);

    this.isFromMemory = isFromMemory;
    this.source = source;

    if (isFromMemory) {
        this.setupFromMemory(source);
    } else {
        this.request = getRequest(source, AsyncModel.handlers[fileType][1], this.setup.bind(this), callbacks.onerror.bind(undefined, this), callbacks.onprogress.bind(undefined, this));
    } 
}

AsyncModel.handlers = {};

AsyncModel.prototype = {
    abort: function () {
        if (this.request && this.request.readyState !== XMLHttpRequest.DONE) {
            this.request.abort();
            return true;
        }
        
        return false;
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
            this.onerror(this, "" + status);
        }
    },

    setupFromMemory: function (memory) {
        var model = new AsyncModel.handlers[this.fileType][0](this, memory, this.customPaths, this.context, this.onerror.bind(undefined, this));
        this.model = model;
        model.initWorker(this, memory, this.customPaths, this.context);

        if (model.ready) {
            this.model = model;
            this.ready = true;

            this.runFunctors();

            this.onload(this);
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

            instance.setup(this.model);
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
    },

    gotMessage: function (type, data) {
        this.model.gotMessage(type, data);
    }
};

mixin(Async.prototype, AsyncModel.prototype);