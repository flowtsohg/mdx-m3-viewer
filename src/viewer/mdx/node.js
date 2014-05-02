function Node(object, model, pivots) {
  this.name = object.name;
  this.objectId = object.objectId;
  this.parentId = object.parentId;
  this.pivot = pivots[object.objectId - 1] || [0, 0, 0];
  this.billboarded = object.billboarded;
  this.xYQuad = object.xYQuad;
  
  if (object.tracks) {
    this.sd = parseSDTracks(object.tracks, model);
  }
}

// Used by each copy of a skeleton to hold the node hierarchy
// Keeps a reference to the actual node containing the animation data, that the model owns
function ShallowNode(node) {
  this.nodeImpl = node;
  this.pivot = node.pivot;
  this.negativePivot = vec3.negate([], node.pivot);
  this.objectId = node.objectId;
  this.parentId = node.parentId;
  this.worldMatrix = mat4.create();
}

ShallowNode.prototype = {
  getTransform: function () {
    var m = mat4.createIdentity();
    
    mat4.multiply(m, m, this.worldMatrix);
    mat4.translate(m, m, this.pivot);
    
    return m;
  }
};