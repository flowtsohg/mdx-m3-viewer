// Spatial mixin.
// Used to add spatial capabilities to an object.
var Spatial = (function () {
  // Create the required variables in the object.
  function setup() {
    this.worldMatrix = mat4.create();
    this.localMatrix = mat4.create();
    this.location = vec3.create();
    this.rotation = quat.create();
    this.eulerRotation = vec3.create();
    this.scaling = vec3.fromValues(1, 1, 1);
    this.parentId = -1;
    this.attachmentId = -1;
    this.parentNode = null;
  }
  
  function recalculateTransformation() {
    mat4.fromRotationTranslationScale(this.localMatrix, this.rotation, this.location, this.scaling);
  }
  
  function move(v) {
    vec3.add(this.location, this.location, v);
    
    this.recalculateTransformation();
  }
  
  function setLocation(v) {
    vec3.copy(this.location, v);
    
    this.recalculateTransformation();
  }
  
  function getLocation() {
    return Array.copy(this.location);
  }
  
  function rotateQuat(q) {
    quat.multiply(this.rotation, this.rotation, q);
    
    this.recalculateTransformation();
  }
  
  function setRotationQuat(q) {
    quat.copy(this.rotation, q);
    
    this.recalculateTransformation();
  }
  
  function getRotationQuat() {
    return Array.copy(this.rotation);
  }
  
  function rotate(v) {
    var eulerRotation = this.eulerRotation;
    
    vec3.add(eulerRotation, eulerRotation, v);
    
    this.setRotation(eulerRotation);
  }
  
  function setRotation(v) {
    var q = quat.create(),
          rotation = this.rotation,
          eulerRotation = this.eulerRotation;
    
    vec3.copy(eulerRotation, v);
    
    quat.identity(rotation);
    
    quat.setAxisAngle(q, xAxis, eulerRotation[0]);
    quat.multiply(rotation, q, rotation);
    
    quat.setAxisAngle(q, yAxis, eulerRotation[1]);
    quat.multiply(rotation, q, rotation);
    
    quat.setAxisAngle(q, zAxis, eulerRotation[2]);
    quat.multiply(rotation, q, rotation);
    
    this.recalculateTransformation();
  }
  
  function getRotation() {
    return vec3.clone(this.eulerRotation);
  }
  
  function scale(n) {
    vec3.scale(this.scaling, this.scaling, n);
    
    this.recalculateTransformation();
  }
  
  function setScale(n) {
    vec3.set(this.scaling, n, n, n);
    
    this.recalculateTransformation();
  }
  
  function getScale() {
    return this.scaling[0];
  }
  
  function setScaleVector(v) {
    vec3.copy(this.scaling, v);
    
    this.recalculateTransformation();
  }
  
  function getScaleVector() {
    // Note: no Array.copy because this function is for internal use, and I don't want garbage collection.
    return this.scaling;
  }
  
  // Requests an attachment point from the parent.
  // The parent will call setParentNode with the correct attachment node instantly if it is loaded, and when it is loaded otherwise.
  function setParent(parent, attachment) {
    if (parent) {
      this.parentId = parent.id;
      this.attachmentId = attachment;
      
      parent.requestAttachment(this, attachment);
    } else {
      this.parentId = -1;
      this.attachmentId = -1;
      this.parentNode = null;
    }
  }
  
  // Called from the parent with the parent node.
  function setParentNode(node) {
    this.parentNode = node;
  }
  
  function getParent() {
    return [this.parentId, this.attachmentId];
  }
  
  function getTransformation(objects) {
    var worldMatrix = this.worldMatrix,
          parentNode = this.parentNode;
    
    mat4.identity(worldMatrix);
    
    if (parentNode) {
      mat4.copy(worldMatrix, parentNode.getTransformation());
      
      // Scale by the inverse of the parent to avoid carrying over scales through the hierarchy
      mat4.scale(worldMatrix, worldMatrix, parentNode.inverseScale);
    }
    
    mat4.multiply(worldMatrix, worldMatrix, this.localMatrix);
    
    return worldMatrix;
  }
  
  return function () {
    this.setupSpatial = setup;
    this.recalculateTransformation = recalculateTransformation;
    this.move = move;
    this.setLocation = setLocation;
    this.getLocation = getLocation;
    this.rotateQuat = rotateQuat;
    this.setRotationQuat = setRotationQuat;
    this.getRotationQuat = getRotationQuat;
    this.rotate = rotate;
    this.setRotation = setRotation;
    this.getRotation = getRotation;
    this.scale = scale;
    this.setScale = setScale;
    this.getScale = getScale;
    this.setScaleVector = setScaleVector;
    this.getScaleVector = getScaleVector;
    this.setParent = setParent;
    this.setParentNode = setParentNode;
    this.getParent = getParent;
    this.getTransformation = getTransformation;
    
    return this;
  };
}());