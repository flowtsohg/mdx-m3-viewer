function BoundingShape(boundingshape, bones) {
  this.bone = boundingshape.bone;
  this.matrix = boundingshape.matrix;
  this.name = bones[boundingshape.bone].name;
  
  var size = boundingshape.size;
  var shape;
  
  if (boundingshape.shape === 0) {
    shape = gl.createCube(-size[0], -size[1], -size[2], size[0], size[1], size[2]);
  } else if (boundingshape.shape === 1) {
    shape = gl.createSphere(0, 0, 0, 9, 9, size[0]);
  } else {
    shape = gl.createCylinder(0, 0, 0, size[0], size[1], 9);
  }
  
  this.shape = shape;
}

BoundingShape.prototype = {
  render: function (shader, bones) {
    if (this.shape) {
      gl.pushMatrix();
        
      gl.multMat(bones[this.bone].worldMatrix);
      gl.multMat(this.matrix);
      
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      
      gl.popMatrix();
      
      this.shape.renderLines(shader);
    }
  }
};