// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function BoundingShape(boundingshape) {
  this.bone = boundingshape.bone;
  this.matrix = boundingshape.matrix;
  
  var size = boundingshape.size;
  var shape;
  
  if (boundingshape.shape === 0) {
    shape = gl.newCube(-size[0], -size[1], -size[2], size[0], size[1], size[2]);
  } else if (boundingshape.shape === 1) {
    shape = gl.newSphere(0, 0, 0, 9, 9, size[0]);
  } else {
    shape = gl.newCylinder(0, 0, 0, size[0], size[1], 9);
  }
  
  this.shape = shape;
}

BoundingShape.prototype = {
  render: function () {
    if (this.shape) {
      this.shape.renderLines();
    }
  }
};