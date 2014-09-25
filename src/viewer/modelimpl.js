// Model implementation mixin.
// Defines all the properties and methods that a model must implement.
var ModelImpl = (function () {
  // Create the required variables in the object.
  function setupImpl(parser, textureMap) {
    this.name = "";
    this.meshes = [];
    this.sequences = [];
    this.textures = [];
    this.cameras = [];
    this.boundingShapes = [];
    this.attachments = [];
    this.textureMap = textureMap;
    
    this.setup(parser, textureMap);
    this.setupShaders(parser);
  }
  
  function setup(parser, textureMap) {
  }
  
  function setupShaders(parser) {
    
  }
  
  function render(instance, context) {
    
  }
  
  function renderEmiters(instance, context) {
    
  }
  
  function renderBoundingShapes(instance, context) {
    
  }
  
  function renderColor(instance, color) {
    
  }
  
  function getName() {
    return this.name;
  }
  
  function getAttachment(id) {
    return this.attachments[id];
  }
  
  function getCamera(id) {
      return this.cameras[id];
  }
  
  function overrideTexture(path, override) {
    this.textureMap[path] = override;
  }
  
  function getTextureMap() {
    var textureMap = Object.copy(this.textureMap);
    
    // Avoid reporting the team color textures, since they are internal.
    // Is there any nicer way to do this?
    delete textureMap["replaceabletextures/teamcolor/teamcolor00.blp"];
    delete textureMap["replaceabletextures/teamglow/teamglow00.blp"];
    
    return textureMap;
  }
  
  function getSequences() {
    return getNamesFromObjects(this.sequences);
  }
  
  function getCameras() {
    return getNamesFromObjects(this.cameras);
  }
  
  function getBoundingShapes() {
    return getNamesFromObjects(this.boundingShapes);
  }
  
  function getAttachments() {
    return getNamesFromObjects(this.attachments);
  }
  
  function getMeshCount() {
    return this.meshes.length;
  }
  
  function getInfo() {
    return {
      name: this.getName(),
      sequences: this.getSequences(),
      attachments: this.getAttachments(),
      cameras: this.getCameras(),
      textureMap: this.getTextureMap(),
      boundingShapes: this.getBoundingShapes(),
      meshCount: this.getMeshCount()
    };
  }
  
  return function () {
    if (!this.setupImpl) { this.setupImpl = setupImpl; }
    if (!this.setup) { this.setup = setup; }
    if (!this.setupShaders) { this.setupShaders = setupShaders; }
    if (!this.render) { this.render = render; }
    if (!this.renderEmiters) { this.renderEmiters = renderEmiters; }
    if (!this.renderBoundingShapes) { this.renderBoundingShapes = renderBoundingShapes; }
    if (!this.renderColor) { this.renderColor = renderColor; }
    if (!this.getName) { this.getName = getName; }
    if (!this.getAttachment) { this.getAttachment = getAttachment; }
    if (!this.getCamera) { this.getCamera = getCamera; }
    if (!this.overrideTexture) { this.overrideTexture = overrideTexture; }
    if (!this.getTextureMap) { this.getTextureMap = getTextureMap; }
    if (!this.getSequences) { this.getSequences = getSequences; }
    if (!this.getCameras) { this.getCameras = getCameras; }
    if (!this.getBoundingShapes) { this.getBoundingShapes = getBoundingShapes; }
    if (!this.getAttachments) { this.getAttachments = getAttachments; }
    if (!this.getMeshCount) { this.getMeshCount = getMeshCount; }
    if (!this.getInfo) { this.getInfo = getInfo; }
    
    return this;
  };
}());