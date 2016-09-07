function MdxCollisionShape(collisionshape, model, gl) {
    this.node = collisionshape.node;

    var v = collisionshape.vertices;
    var radius = collisionshape.radius;
    var shape;

    if (collisionshape.type === 0) {
        shape = gl.createCube(v[0], v[1], v[2], v[0], v[1], v[2]);
        //} else if (collisionshape.type === 1) {
        //shape = gl.newPlane(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
    } else if (collisionshape.type === 2) {
        shape = gl.createSphere(v[0], v[1], v[2], 9, 9, radius);
        //} else {
        //shape = gl.newCylinder(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], 8, 2, boundsRadius);
    }

    this.shape = shape;
}

MdxCollisionShape.prototype = {
    render(skeleton, shader, gl) {
        var ctx = gl.ctx;

        if (this.shape) {
            gl.pushMatrix();

            gl.multMat(skeleton.nodes[this.node].worldMatrix);

            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());

            this.shape.renderLines(shader);

            gl.popMatrix();
        }
    }
};
