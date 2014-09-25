// Model instance implementation mixin.
// Defines all the properties and methods that a model instance must implement.
var ModelInstanceImpl = (function () {
  // Create the required variables in the object.
  function setupImpl(model, textureMap) {
    var i,
          l;
    
    this.model = model;
    this.textureMap = textureMap;
    this.sequence = -1;
    this.frame = 0;
    this.sequenceLoopMode = 0;
    this.meshVisibilities = [];
    
    for (i = 0, l = model.getMeshCount(); i < l; i++) {
      this.meshVisibilities[i] = true;
    }
    
    this.setup(model, textureMap);
  }
  
  function setup(model, textureMap) {
    
  }
  
  function update(instance, context) {
    
  }
  
  function render(instance, context) {
    this.model.render(this, context);
  }
  
  function renderEmitters(instance, context) {
    this.model.renderEmitters(this, context);
  }

  function renderBoundingShapes(instance, context) {
    this.model.renderBoundingShapes(this, context);
  }

  function renderColor(instance) {
    this.model.renderColor(this, instance.color);
  }
  
  function getName() {
    return this.model.getName();
  }
  
  function getAttachment(id) {
    
  }
  
  function overrideTexture(path, override) {
    this.textureMap[path] = override;
  }
  
  function getTextureMap() {
    return Object.copy(this.textureMap);
  }
  
  function setTeamColor(id) {
    
  }
  
  function setSequence(id) {
    
  }
  
  function setSequenceLoopMode(mode) {
    this.sequenceLoopMode = mode;
  }
  
  function getMeshVisibilities() {
    return Array.copy(this.meshVisibilities);
  }
  
  function setMeshVisibility(meshId, b) {
    this.meshVisibilities[meshId] = b;
  }
  
  function getMeshVisibility(meshId) {
    return this.meshVisibilities[meshId];
  }
  
  return function () {
    if (!this.setupImpl) { this.setupImpl = setupImpl; }
    if (!this.setup) { this.setup = setup; }
    if (!this.update) { this.update = update; }
    if (!this.render) { this.render = render; }
    if (!this.renderEmitters) { this.renderEmitters = renderEmitters; }
    if (!this.renderBoundingShapes) { this.renderBoundingShapes = renderBoundingShapes; }
    if (!this.renderColor) { this.renderColor = renderColor; }
    if (!this.getName) { this.getName = getName; }
    if (!this.getAttachment) { this.getAttachment = getAttachment; }
    if (!this.overrideTexture) { this.overrideTexture = overrideTexture; }
    if (!this.getTextureMap) { this.getTextureMap = getTextureMap; }
    if (!this.setTeamColor) { this.setTeamColor = setTeamColor; }
    if (!this.setSequence) { this.setSequence = setSequence; }
    if (!this.setSequenceLoopMode) { this.setSequenceLoopMode = setSequenceLoopMode; }
    if (!this.getMeshVisibilities) { this.getMeshVisibilities = getMeshVisibilities; }
    if (!this.setMeshVisibility) { this.setMeshVisibility = setMeshVisibility; }
    if (!this.getMeshVisibility) { this.getMeshVisibility = getMeshVisibility; }
    
    return this;
  };
}());