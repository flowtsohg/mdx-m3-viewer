/**
 * Creates a new BaseModel.
 *
 * @class A skeleton model. Can be used to help extending the viewer with new model types.
 * @name BaseModel
 * @param {object} textureMap An object with texture path -> absolute urls mapping.
 * @property {string} name
 * @property {array} meshes
 * @property {array} sequences
 * @property {array} textures
 * @property {array} cameras
 * @property {array} boundingShapes
 * @property {array} attachments
 * @property {object} textureMap
 */
window["BaseModel"] = function (textureMap) {
  this.name = "";
  this.meshes = [];
  this.sequences = [];
  this.textures = [];
  this.cameras = [];
  this.boundingShapes = [];
  this.attachments = [];
  this.textureMap = textureMap;
}

BaseModel.prototype = {
  /**
    * Render a model for some specific model instance.
    *
    * @param {BaseModelInstance} instance The instance that is getting rendered.
    * @param {object} context An object containing the global state of the viewer.
    */
  render: function(instance, context) {
  
  },

  /**
    * Render a model's particle emitters for some specific model instance.
    *
    * @param {BaseModelInstance} instance The instance that is getting rendered.
    * @param {object} context An object containing the global state of the viewer.
    */
  renderEmitters: function(instance, context) {
    
  },

  /**
    * Render a model's bounding shapes o for some specific model instance.
    *
    * @param {BaseModelInstance} instance The instance that is getting rendered.
    * @param {object} context An object containing the global state of the viewer.
    */
  renderBoundingShapes: function(instance, context) {
    
  },

  /**
    * Render a model with a specific color for some specific model instance.
    * This is used for color picking.
    *
    * @param {BaseModelInstance} instance The instance that is getting rendered.
    * @param {vec3} color A RGB color in which the model should be rendered.
    * @param {object} context An object containing the global state of the viewer.
    */
  renderColor: function(instance, color, context) {
    
  },

  /**
    * Gets the name of a model.
    *
    * @returns {string} The model's name.
    */
  getName: function() {
    return this.name;
  },

  /**
    * Gets a model's attachment.
    *
    * @param {number} id The id of the attachment.
    * @returns {Node} The attachment.
    */
  getAttachment: function(id) {
    return this.attachments[id];
  },

  /**
    * Gets a model's camera.
    *
    * @param {number} id The id of the camera.
    * @returns {Camera} The camera.
    */
  getCamera: function(id) {
      return this.cameras[id];
  },

  /**
    * Overrides a texture used by a model.
    *
    * @param {string} path The texture path that gets overriden.
    * @paran {string} override The new absolute path that will be used.
    */
  overrideTexture: function(path, override) {
    this.textureMap[path] = override;
  },

  /**
    * Gets a model's texture map.
    *
    * @returns {object} The texture map.
    */
  getTextureMap: function() {
    return Object.copy(this.textureMap);
  },

  /**
    * Gets a model's sequences list.
    *
    * @returns {array} The list of sequence names.
    */
  getSequences: function() {
    return getNamesFromObjects(this.sequences);
  },

  /**
    * Gets a model's attachments list.
    *
    * @returns {array} The list of attachment names.
    */
  getAttachments: function() {
    return getNamesFromObjects(this.attachments);
  },
  
  /**
    * Gets a model's bounding shapes list.
    *
    * @returns {array} The list of bounding shape names.
    */
  getBoundingShapes: function() {
    return getNamesFromObjects(this.boundingShapes);
  },
  
  /**
    * Gets a model's cameras list.
    *
    * @returns {array} The list of camera names.
    */
  getCameras: function() {
    return getNamesFromObjects(this.cameras);
  },

  /**
    * Gets a model's number of meshes.
    *
    * @returns {number} The number of meshes.
    */
  getMeshCount: function() {
    return this.meshes.length;
  }
};