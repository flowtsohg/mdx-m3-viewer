// TODO
//
// To make getTransformation truely generic, the node types need to include more information.
// Specifically, nodes should have their current scale, scaled by the parent.
// If we look at every position-able object as a node, every node needs to know its local and world transformation values.
// This is because we need the inverse scaling factor for all three axes.
//
// Is it possible to get the nodes to use this mixin and thus make everything work properly?
//

// Spatial mixin.
// Used to add spatial capabilities to an object.
var Spatial = (function () {
  // Create the required variables in the object.
  function useSpatial() {
    this.worldMatrix = mat4.create();
    this.localMatrix = mat4.create();
    this.location = vec3.create();
    this.rotation = quat.create();
    this.scaling = vec3.fromValues(1, 1, 1);
    this.inverseScaling = vec3.fromValues(1, 1, 1);
    this.parentId = -1;
    this.attachment = -1;
    this.parentRef = null;
    this.parentNode = null;
  }
  
  function recalculateTransformation() {
    mat4.fromRotationTranslationScale(this.localMatrix, this.rotation, this.location, this.scaling);
  }
  
  function move (v) {
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
  
  function rotate(q) {
    quat.multiply(this.rotation, this.rotation, q);
    
    this.recalculateTransformation();
  }
  
  function setRotation(q) {
    quat.copy(this.rotation, q);
    
    this.recalculateTransformation();
  }
  
  function getRotation() {
    return Array.copy(this.rotation);
  }
  
  function scale(n) {
    vec3.scale(this.scaling, this.scaling, n);
    vec3.inverse(this.inverseScaling, this.scaling);
    
    this.recalculateTransformation();
  }
  
  function setScale(n) {
    vec3.set(this.scaling, n, n, n);
    vec3.inverse(this.inverseScaling, this.scaling);
    
    this.recalculateTransformation();
  }
  
  function getScale() {
    return this.scaling[0];
  }
  
  // Requests an attachment point from the parent.
  // The parent will call setParentNode with the correct attachment node instantly if it is loaded, and when it is loaded otherwise.
  function setParent(parent, attachment) {
    this.parentRef = parent;
    
    if (parent) {
      this.parentId = parent.id;
      this.attachmentId = attachment;
      
      parent.requestAttachment(this, attachment);
    } else {
      this.parentId = -1;
      this.attachmentId = -1;
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
          parentNode = this.parentNode,
          parentRef = this.parentRef;
    
    mat4.identity(worldMatrix);
    
    if (parentNode) {
      mat4.multiply(worldMatrix, worldMatrix, parentNode.getTransformation());
      
      // Scale by the inverse of the parent to avoid carrying over scales through the hierarchy
      mat4.scale(worldMatrix, worldMatrix, parentRef.inverseScaling);
      
      // To avoid the 90 degree rotations applied to M3 models
      if (parentRef.fileType !== "mdx") {
        mat4.rotate(worldMatrix, worldMatrix, -Math.PI / 2, zAxis);
      }
    }
    
    mat4.multiply(worldMatrix, worldMatrix, this.localMatrix);
    
    return worldMatrix;
  }
  
  return function () {
    this.useSpatial = useSpatial;
    this.recalculateTransformation = recalculateTransformation;
    this.move = move;
    this.setLocation = setLocation;
    this.getLocation = getLocation;
    this.rotate = rotate;
    this.setRotation = setRotation;
    this.getRotation = getRotation;
    this.scale = scale;
    this.setScale = setScale;
    this.getScale = getScale;
    this.setParent = setParent;
    this.setParentNode = setParentNode;
    this.getParent = getParent;
    this.getTransformation = getTransformation;
    
    return this;
  };
}());