function CollisionShape(collisionshape) {
  this.node = collisionshape.node;
  
  var v = collisionshape.vertices;
  var v1 = v[0];
  var v2 = v[1];
  var boundsRadius = collisionshape.boundsRadius;
  var shape;
  
  if (collisionshape.type === 0) {
    shape = gl.createCube(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
  //} else if (collisionshape.type === 1) {
    //shape = gl.newPlane(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
  } else if (collisionshape.type === 2) {
    shape = gl.createSphere(v1[0], v1[1], v1[2], 9, 9, boundsRadius);
  //} else {
    //shape = gl.newCylinder(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], 8, 2, boundsRadius);
  }
  
  this.shape = shape;
}

CollisionShape.prototype = {
  render: function (skeleton, shader) {
    if (this.shape) {
      gl.pushMatrix();
      
      gl.multMat(skeleton.nodes[this.node].worldMatrix);
      
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      
      this.shape.renderLines(shader);
      
      gl.popMatrix();
    }
  }
};