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
function AsyncModelInstance(asyncModel, id, color, textureMap, context, onload) {
    this.type = "instance";
    this.ready = false;
    this.fileType = asyncModel.fileType;
    this.asyncModel = asyncModel;
    this.id = id;

    this.source = asyncModel.source;
    this.visible = 1;

    // Used for color picking
    this.color = color;

    // If the model is already ready, the onload message from setup() must be delayed, since this instance wouldn't be added to the cache yet.
    if (asyncModel.ready) {
        this.delayOnload = true;
    }

    this.context = context;

    this.onload = onload || function () {};

    Async.call(this);
    Spatial.call(this);

    // Request the setup function to be called by the model when it can.
    // If the model is loaded, setup runs instantly, otherwise it runs when the model finishes loading.
    asyncModel.setupInstance(this, textureMap || {});
}

AsyncModelInstance.handlers = {};

AsyncModelInstance.prototype = {
  /**
    * Setup a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {BaseModel} model The model implementation this instance points to.
    * @param {object} textureMap An object with texture path -> absolute urls mapping.
    */
    setup: function (model, textureMap) {
        this.instance = new AsyncModelInstance.handlers[this.fileType](model, textureMap, this.context);

        this.ready = true;

        this.runFunctors();

        this.recalculateTransformation();

        if (!this.delayOnload) {
            this.onload(this);
        }

        if (this.context.debugMode) {
            console.log(this.instance);
        }
    },
  
  /**
    * Updates a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    update: function (context) {
        if (this.ready) {
            this.instance.update(this.getTransformation(), context);
        }
    },
  
  /**
    * Render a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    render: function (context) {
        if (this.ready && this.visible) {
            this.instance.render(context);
        }
    },
  
  /**
    * Render the particle emitters of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    renderEmitters: function (context) {
        if (this.ready && this.visible) {
            this.instance.renderEmitters(context);
        }
    },
  
  /**
    * Render the bounding shapes of a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    renderBoundingShapes: function (context) {
        if (this.ready && this.visible) {
            this.instance.renderBoundingShapes(context);
        }
    },
  
  /**
    * Render a model instance with a specific color.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @param {object} context An object containing the global state of the viewer.
    */
    renderColor: function (context) {
        if (this.ready && this.visible) {
            this.instance.renderColor(this.color, context);
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
        return this.asyncModel.source;
    },
  
  // Sets the parent value of a requesting Spatial.
    setRequestedAttachment: function (requester, attachment) {
        requester.setParentNode(this.instance.getAttachment(attachment));
    },
  
    requestAttachment: function (requester, attachment) {
        if (this.ready) {
            return this.setRequestedAttachment(requester, attachment);
        } else {
            this.addFunctor("setRequestedAttachment", [requester, attachment]);
        }
    },
  
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
            return this.instance.getCamera(id);
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
            return this.asyncModel.getSequences();
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
            return this.asyncModel.getAttachments();
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
            return this.asyncModel.getBoundingShapes();
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
            return this.asyncModel.getCameras();
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
            return this.asyncModel.getMeshCount();
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
  
  /**
    * Gets a model instance's information. This includes most of the getters, and also the information from {@link AsyncModel.getInfo}.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {object} The model instance information.
    */
    getInfo: function () {
        return {
            modelInfo: this.asyncModel.getInfo(),
            visible: this.getVisibility(),
            sequence: this.getSequence(),
            sequenceLoopMode: this.getSequenceLoopMode(),
            location: this.getLocation(),
            rotation: this.getRotation(),
            rotationQuat: this.getRotationQuat(),
            scale: this.getScale(),
            parent: this.getParent(),
            teamColor: this.getTeamColor(),
            textureMap: this.getTextureMap(),
            meshVisibilities: this.getMeshVisibilities(),
            name: this.getName()
        };
    },
  
  /**
    * Gets a model instance's representation as an object that will be converted to JSON.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @returns {object} The JSON representation.
    */
    toJSON: function () {
        // For some reason, when typed arrays are JSON stringified they change to object notation rather than array notation.
        // This is why I don't bother to access the location and rotation directly.
        var location = this.getLocation(),
            rotation = Array.toDeg(this.getRotation()),
            scale = this.getScale(),
            textureMap = {},
            localTextureMap = this.getTextureMap(),
            modelTextureMap = this.asyncModel.getTextureMap(),
            keys = Object.keys(localTextureMap),
            visibilities = this.getMeshVisibilities(),
            key,
            i,
            l;
        

        // This code avoids saving instance overrides that match the model's texture map.
        // For example, when the client overrides a texture and then sets it back to the original value.
        for (i = 0, l = keys.length; i < l; i++) {
            key = keys[i];

            if (localTextureMap[key] !== modelTextureMap[key]) {
                textureMap[key] = localTextureMap[key];
            }
        }

        // To avoid silly numbers like 1.0000000000000002
        location = Array.setFloatPrecision(location, 2);
        rotation = Array.setFloatPrecision(rotation, 0);
        scale = Math.setFloatPrecision(scale, 2);

        // Turn booleans to numbers to shorten the string.
        for (i = 0, l = visibilities.length; i < l; i++) {
            visibilities[i] = visibilities[i] & 1;
        }

        return [
            this.id,
            this.asyncModel.id,
            this.getVisibility() & 1,
            this.getSequence(),
            this.getSequenceLoopMode(),
            location,
            rotation,
            scale,
            this.getParent(),
            this.getTeamColor(),
            textureMap,
            visibilities
        ];
    },
  
  /**
    * Applies the settings of a JSON representation to a model instance.
    *
    * @memberof AsyncModelInstance
    * @instance
    * @object {object} The JSON representation.
    */
    fromJSON: function (object) {
        var textureMap = object[10],
            visibilities = object[11],
            keys = Object.keys(textureMap),
            key,
            i,
            l;

        this.setVisibility(!!object[2]);
        this.setSequence(object[3]);
        this.setSequenceLoopMode(object[4]);
        this.setLocation(object[5]);
        this.rotate(Array.toRad(object[6]));
        this.setScale(object[7]);
        this.setTeamColor(object[9]);

        for (i = 0, l = keys.length; i < l; i++) {
            key = keys[i];

            this.overrideTexture(key, textureMap[key]);
        }

        for (i = 0, l = visibilities.length; i < l; i++) {
            this.setMeshVisibility(i, visibilities[i]);
        }
    }
};

mixin(Async.prototype, AsyncModelInstance.prototype);
mixin(Spatial.prototype, AsyncModelInstance.prototype);