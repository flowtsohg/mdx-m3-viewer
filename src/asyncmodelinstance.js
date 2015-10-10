/**
 * Creates a new AsyncModelInstance.
 *
 * @class The parent of {@link BaseModelInstance}. Takes care of all the asynchronous aspects of loading model instances. 
 * @name AsyncModelInstance
 * @mixes Async
 * @mixes Spatial
 * @param {AsyncModel} model The model this instance points to.
 * @param {number} id The id of this instance.
 * @param {vec3} color The color this instance uses for {@link AsyncModelInstance.renderColor}.
 * @param {object} textureMap An object with texture path -> absolute urls mapping.
 */
function AsyncModelInstance(asyncModel, isInternal) {
    this.type = "instance";
    this.ready = false;
    this.id = generateID();
    this.color = decodeFloat3(this.id);
    this.tint = vec4.fromValues(1, 1, 1, 1);
    this.visible = 1;
    this.selectable = 1;
    this.pathSolver = asyncModel.pathSolver;
    this.isInternal = isInternal;
    this.asyncModel = asyncModel;
    this.context = asyncModel.context;

    Async.call(this);
    Node.call(this, true);
    EventDispatcher.call(this);
}

AsyncModelInstance.handlers = {};

AsyncModelInstance.prototype = {
    reportError: function (error) {
        this.dispatchEvent({ type: "error", error: error });
        this.dispatchEvent("loadend");
    },

    reportLoad: function () {
        this.ready = true;

        this.runFunctors();

        this.dispatchEvent("load");
        this.dispatchEvent("loadend");
    },

    loadstart: function () {
        this.dispatchEvent("loadstart");
        
        this.asyncModel.setupInstance(this);
    },

  /**
    * Setup a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {BaseModel} model The model implementation this instance points to.
    * @param {object} textureMap An object with texture path -> absolute urls mapping.
    */
    setup: function () {
        this.instance = new AsyncModelInstance.handlers[this.asyncModel.fileType]();
        this.instance.loadstart(this, this.reportError.bind(this), this.reportLoad.bind(this));
    },
  
  /**
    * Updates a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    update: function () {
        if (this.ready) {
            this.instance.update();
        }
    },
  
  /**
    * Render a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    render: function () {
        if (this.ready && this.visible) {
            this.instance.render();
        }
    },
  
  /**
    * Render the particle emitters of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    renderEmitters: function () {
        if (this.ready && this.visible) {
            this.instance.renderEmitters();
        }
    },
  
  /**
    * Render the bounding shapes of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    renderBoundingShapes: function () {
        if (this.ready && this.visible) {
            this.instance.renderBoundingShapes();
        }
    },
  
  /**
    * Render a model instance with a specific color.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    renderColor: function () {
        if (this.ready && this.visible && this.selectable) {
            this.instance.renderColor();
        }
    },
  
  /**
    * Gets the name of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {string} The instance's name.
    */
    getName: function () {
        if (this.ready) {
            return this.instance.getName() + "[" + this.id + "]";
        }
    },
  
  /**
    * Gets the source of the model a model instance points to.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {string} The model's source.
    */
    getSource: function () {
        return this.model.source;
    },
  
  // Sets the parent value of a requesting Spatial.
    //setRequestedAttachment: function (requester, attachment) {
    //    requester.setParentNode(this.instance.getAttachment(attachment));
    //},
  
    //requestAttachment: function (requester, attachment) {
    //    if (this.ready) {
    //        return this.setRequestedAttachment(requester, attachment);
    //    } else {
    //        this.addFunctor("setRequestedAttachment", [requester, attachment]);
    //    }
    //},
  
  /**
    * Overrides a texture used by a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {string} path The texture path that gets overriden.
    * @paran {string} override The new absolute path that will be used.
    */
    overrideTexture: function (path, override) {
        if (this.ready) {
            this.instance.overrideTexture(path, override);
        } else {
            this.addFunctor("overrideTexture", [path, override]);
        }
    },
  
  /**
    * Gets a model instance's texture map.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {object} The texture map.
    */
    getTextureMap: function () {
        if (this.ready) {
            return this.instance.getTextureMap();
        }
    },
  
  /**
    * Set the team color of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {number} id The team color.
    */
    setTeamColor: function (id) {
        if (this.ready) {
            this.instance.setTeamColor(id);
        } else {
            this.addFunctor("setTeamColor", [id]);
        }
    },
  
  /**
    * Gets the team color of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {number} The team.
    */
    getTeamColor: function () {
        if (this.ready) {
            return this.instance.getTeamColor();
        }
    },
  
  /**
    * Set the sequence of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {number} id The sequence.
    */
    setSequence: function (id) {
        if (this.ready) {
            this.instance.setSequence(id);
        } else {
            this.addFunctor("setSequence", [id]);
        }
    },
  
  /**
    * Gets the sequence of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {number} The sequence.
    */
    getSequence: function () {
        if (this.ready) {
            return this.instance.getSequence();
        }
    },
  
  /**
    * Set the sequence loop mode of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {number} mode The sequence loop mode.
    */
    setSequenceLoopMode: function (mode) {
        if (this.ready) {
            this.instance.setSequenceLoopMode(mode);
        } else {
            this.addFunctor("setSequenceLoopMode", [mode]);
        }
    },
  
  /**
    * Gets the sequence loop mode of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {number} The sequence loop mode.
    */
    getSequenceLoopMode: function () {
        if (this.ready) {
            return this.instance.getSequenceLoopMode();
        }
    },
  
  /**
    * Gets a model instance's attachment.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {number} id The id of the attachment.
    * @returns {Node} The attachment.
    */
    getAttachment: function (id) {
        if (this.ready) {
            return this.instance.getAttachment(id);
        }
    },
  
  /**
    * Gets a model instance's camera.
    *
    * @memberof AsyncModelInstance
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
    * Set a model instance's mesh's visibility.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {number} id The mesh.
    * @param {boolean} mode The visibility mode
    */
    setMeshVisibility: function (id, mode) {
        if (this.ready) {
            this.instance.setMeshVisibility(id, mode);
        } else {
            this.addFunctor("setMeshVisibility", [id, mode]);
        }
    },
  
  /**
    * Gets a model instance's mesh's visibility
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {number} id The mesh.
    * @returns {boolean} The mesh's visiblity.
    */
    getMeshVisibility: function (id) {
        if (this.ready) {
            return this.instance.getMeshVisibility(id);
        }
    },
  
  /**
    * Gets a model instance's mesh's visibility
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {number} id The mesh.
    * @returns {boolean} The mesh's visiblity.
    */
    getMeshVisibilities: function () {
        if (this.ready) {
            return this.instance.getMeshVisibilities();
        }
    },
  
  /**
    * Gets the sequences of a model a model instance points to.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {array} The list of sequence names.
    */
    getSequences: function () {
        if (this.ready) {
            return this.model.getSequences();
        }
    },
  
  /**
    * Gets the attachments of a model a model instance points to.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {array} The list of attachment names.
    */
    getAttachments: function () {
        if (this.ready) {
            return this.model.getAttachments();
        }
    },
  
  /**
    * Gets the bounding shapes of a model a model instance points to.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {array} The list of bounding shape names.
    */
    getBoundingShapes: function() {
        if (this.ready) {
            return this.model.getBoundingShapes();
        }
    },
  
  /**
    * Gets the cameras of a model a model instance points to.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {array} The list of camera names.
    */
    getCameras: function () {
        if (this.ready) {
            return this.model.getCameras();
        }
    },
  
  /**
    * Gets the number of meshes of a model a model instance points to.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {number} The number of meshes.
    */
    getMeshCount: function () {
        if (this.ready) {
            return this.model.getMeshCount();
        }
    },
  
  /**
    * Sets a model instance's visibility.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {boolean} mode The visibility.
    */
    setVisibility: function (mode) {
        this.visible = mode;
    },
  
  /**
    * Gets a model instance's visibility.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {boolean} The visibility.
    */
    getVisibility: function () {
        return this.visible;
    },
  
    getPolygonCount: function () {
        if (this.ready) {
            return this.model.getPolygonCount();
        }
    }
};

mixin(Async.prototype, AsyncModelInstance.prototype);
mixin(Node.prototype, AsyncModelInstance.prototype);
mixin(EventDispatcher.prototype, AsyncModelInstance.prototype);
