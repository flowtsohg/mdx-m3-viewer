// Abstract model instance implementation.
// Defines all the properties and methods that a model instance must implement.
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
  update: function(worldMatrix, context) {
    
  },

  render: function(context) {
    this.model.render(this, context);
  },

  renderEmitters: function(context) {
    this.model.renderEmitters(this, context);
  },

  renderBoundingShapes: function(context) {
    this.model.renderBoundingShapes(this, context);
  },

  renderColor: function(color, context) {
    this.model.renderColor(this, color, context);
  },

  getName: function() {
    return this.model.getName();
  },

  getAttachment: function(id) {
    
  },

  overrideTexture: function(path, override) {
    this.textureMap[path] = override;
  },

  getTextureMap: function() {
    return Object.copy(this.textureMap);
  },

  setTeamColor: function(id) {
    
  },

  getTeamColor: function() {
    return this.teamColor;
  },

  setSequence: function(id) {
    
  },

  getSequence: function() {
    return this.sequence;
  },

  setSequenceLoopMode: function(mode) {
    this.sequenceLoopMode = mode;
  },

  getSequenceLoopMode: function() {
    return this.sequenceLoopMode;
  },

  getMeshVisibilities: function() {
    return Array.copy(this.meshVisibilities);
  },

  setMeshVisibility: function(id, mode) {
    this.meshVisibilities[id] = mode;
  },

  getMeshVisibility: function(id) {
    return this.meshVisibilities[id];
  }
};