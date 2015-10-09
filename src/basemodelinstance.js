/**
 * Creates a new BaseModelInstance.
 *
 * @class A skeleton model instance. Can be used to help extending the viewer with new model types.
 * @name BaseModelInstance
 * @param {BaseModel} model The model this instance points to.
 * @param {object} textureMap An object with texture path -> absolute urls mapping.
 * @property {BaseModel} model
 * @property {object} textureMap
 * @property {number} sequence
 * @property {number} frame
 * @property {number} sequenceLoopMode
 * @property {number} teamColor
 * @property {array} meshVisibilities
 */
window["BaseModelInstance"] = function (model, textureMap) {
    var i,
        l;

    this.model = model;
    this.textureMap = textureMap;
    this.sequence = -1;
    this.frame = 0;
    this.sequenceLoopMode = 0;
    this.teamColor = 0;
    this.meshVisibilities = [];

    for (i = 0, l = model.getMeshCount(); i < l; i++) {
        this.meshVisibilities[i] = true;
    }
}

BaseModelInstance.prototype = {
  /**
    * Updates a model instance.
    *
    * @param {mat4} worldMatrix The world matrix of the parent {@link AsyncModelInstance}.
    * @param {object} context An object containing the global state of the viewer.
    */
    update: function() {

    },

  /**
    * Render the model a model instance points to.
    *
    * @param {object} context An object containing the global state of the viewer.
    */
    render: function() {
        this.model.render(this);
    },

  /**
    * Render the particle emitters of the model a model instance points to.
    *
    * @param {object} context An object containing the global state of the viewer.
    */
    renderEmitters: function() {
        this.model.renderEmitters(this);
    },

  /**
    * Render the bounding shapes of the model a model instance points to.
    *
    * @param {object} context An object containing the global state of the viewer.
    */
    renderBoundingShapes: function() {
        this.model.renderBoundingShapes(this);
    },

  /**
    * Render the model a model instance points to, with a specific color.
    *
    * @param {vec3} color A RGB color.
    * @param {object} context An object containing the global state of the viewer.
    */
    renderColor: function() {
        this.model.renderColor(this);
    },

  /**
    * Gets the name of the model a model instance points to.
    *
    * @returns {string} The model's name.
    */
    getName: function() {
        return this.model.getName();
    },

  /**
    * Overrides a texture used by a model instance.
    *
    * @param {string} path The texture path that gets overriden.
    * @paran {string} override The new absolute path that will be used.
    */
    overrideTexture: function(path, override) {
        this.textureMap[path] = override;
    },

  /**
    * Gets a model instance's texture map.
    *
    * @returns {object} The texture map.
    */
    getTextureMap: function() {
        return Object.copy(this.textureMap);
    },

  /**
    * Set the team color of a model instance.
    *
    * @param {number} id The team color.
    */
    setTeamColor: function(id) {

    },

  /**
    * Gets the team color of a model instance.
    *
    * @returns {number} The team.
    */
    getTeamColor: function() {
        return this.teamColor;
    },

  /**
    * Set the sequence of a model instance.
    *
    * @param {number} id The sequence.
    */
    setSequence: function(id) {

    },
    
    /**
        * Stop the current sequence.
        * Equivalent to setSequence(-1).
        */
    stopSequence: function () {
        this.setSequence(-1);
    },

  /**
    * Gets the sequence of a model instance.
    *
    * @returns {number} The sequence.
    */
    getSequence: function() {
        return this.sequence;
    },

  /**
    * Set the sequence loop mode of a model instance.
    *
    * @param {number} mode The sequence loop mode.
    */
    setSequenceLoopMode: function(mode) {
        this.sequenceLoopMode = mode;
    },

  /**
    * Gets the sequence loop mode of a model instance.
    *
    * @returns {number} The sequence loop mode.
    */
    getSequenceLoopMode: function() {
        return this.sequenceLoopMode;
    },

  /**
    * Gets a model instance's attachment.
    *
    * @param {number} id The id of the attachment.
    * @returns {Node} The attachment.
    */
    getAttachment: function(id) {

    },
  
  /**
    * Set a model instance's mesh's visibility.
    *
    * @param {number} id The mesh.
    * @param {boolean} mode The visibility mode
    */
    setMeshVisibility: function(id, mode) {
        this.meshVisibilities[id] = mode;
    },

  /**
    * Gets a model instance's mesh's visibility
    *
    * @param {number} id The mesh.
    * @returns {boolean} The mesh's visiblity.
    */
    getMeshVisibility: function(id) {
        return this.meshVisibilities[id];
    },
  
  /**
    * Gets all the mesh visibilities of a model instance.
    *
    * @returns {array} The mesh visibilities.
    */
    getMeshVisibilities: function() {
        return this.meshVisibilities;
    }
};