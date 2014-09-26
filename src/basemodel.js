// Abstract model implementation.
// Defines all the properties and methods that a model must implement.
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
   render: function(instance, context) {
    
  },

  renderEmitters: function(instance, context) {
    
  },

  renderBoundingShapes: function(instance, context) {
    
  },

  renderColor: function(instance, color, context) {
    
  },

  getName: function() {
    return this.name;
  },

  getAttachment: function(id) {
    return this.attachments[id];
  },

  getCamera: function(id) {
      return this.cameras[id];
  },

  overrideTexture: function(path, override) {
    this.textureMap[path] = override;
  },

  getTextureMap: function() {
    var textureMap = Object.copy(this.textureMap);
    
    // Avoid reporting the team color textures, since they are internal.
    // Is there any nicer way to do this?
    delete textureMap["replaceabletextures/teamcolor/teamcolor00.blp"];
    delete textureMap["replaceabletextures/teamglow/teamglow00.blp"];
    
    return textureMap;
  },

  getSequences: function() {
    return getNamesFromObjects(this.sequences);
  },

  getCameras: function() {
    return getNamesFromObjects(this.cameras);
  },

  getBoundingShapes: function() {
    return getNamesFromObjects(this.boundingShapes);
  },

  getAttachments: function() {
    return getNamesFromObjects(this.attachments);
  },

  getMeshCount: function() {
    return this.meshes.length;
  }
};