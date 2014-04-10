// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Node(object, model, pivots) {
  this.name = object.name;
  this.objectId = object.objectId;
  this.parentId = object.parentId;
  this.pivot = pivots[object.objectId - 1] || [0, 0, 0];
  
  if (object.tracks) {
    this.sd = parseSDTracks(object.tracks, model);
  }
}

// Used by each copy of a skeleton to hold the node hierarchy
// Keeps a reference to the actual node containing the animation data, that the model owns
function ShallowNode(node) {
  this.nodeImpl = node;
  this.pivot = node.pivot;
  this.objectId = node.objectId;
  this.parentId = node.parentId;
  this.worldMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

ShallowNode.prototype = {
  getTransform: function () {
    var m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    
    math.mat4.multMat(m, this.worldMatrix, m);
    math.mat4.translate(m, this.pivot[0], this.pivot[1], this.pivot[2]);
    
    
    return m;
  }
};