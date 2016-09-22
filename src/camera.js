function Camera(fieldOfView, aspect, nearClipPlane, farClipPlane) {
    Node.call(this);

    this.fieldOfView = fieldOfView;
    this.aspectRatio = aspect;
    this.nearClipPlane = nearClipPlane;
    this.farClipPlane = farClipPlane;
    this.viewport = vec4.create();
    this.projectionMatrix = mat4.create();
    this.worldProjectionMatrix = mat4.create();
    this.inverseWorldMatrix = mat4.create();
    this.inverseRotation = quat.create();
    this.inverseRotationMatrix = mat4.create();
    this.inverseWorldProjectionMatrix = mat4.create();

    // First four vectors are the corners of a 2x2 rectangle, the last three vectors are the unit axes
    this.vectors = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)];

    // First four vectors are the corners of a 2x2 rectangle billboarded to the camera, the last three vectors are the unit axes billboarded
    this.billboardedVectors = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];

    this.recalculateTransformation();
}

Camera.prototype = {
    setViewport(viewport) {
        vec4.copy(this.viewport, viewport);
        
        this.aspectRatio = viewport[2] / viewport[3];
        
        this.recalculateTransformation();
    },

    recalculateTransformation() {
        const worldMatrix = this.worldMatrix,
            projectionMatrix = this.projectionMatrix,
            worldProjectionMatrix = this.worldProjectionMatrix,
            inverseRotation = this.inverseRotation,
            vectors = this.vectors,
            billboardedVectors = this.billboardedVectors;

        // Projection matrix
        // Camera space -> NDC space
        mat4.perspective(projectionMatrix, this.fieldOfView, this.aspectRatio, this.nearClipPlane, this.farClipPlane);

        // Recalculate the node part
        Node.prototype.recalculateTransformation.call(this);

        // World projection matrix
        // World space -> NDC space
        mat4.mul(worldProjectionMatrix, projectionMatrix, worldMatrix);

        // Inverse rotation matrix
        // Used for billboarding etc.
        quat.invert(inverseRotation, this.worldRotation);
        mat4.fromQuat(this.inverseRotationMatrix, inverseRotation);

        // Inverse world matrix
        // Camera space -> World space
        mat4.invert(this.inverseWorldMatrix, worldMatrix);

        // Inverse world projection matrix
        // NDC space -> World space
        mat4.invert(this.inverseWorldProjectionMatrix, worldProjectionMatrix);

        // Cache the billboarded vectors
        for (let i = 0; i < 7; i++) {
            vec3.transformQuat(billboardedVectors[i], vectors[i], inverseRotation);
        }
    },

    // Given a vector in camera space, return the vector transformed to world space
    cameraToWorld(out, v) {
        vec3.copy(out, v);
        vec3.transformMat4(out, out, this.inverseWorldMatrix);

        return out;
    },

    // Given a vector in world space, return the vector transformed to camera space
    worldToCamera(out, v) {
        vec3.transformQuat(out, v, this.inverseRotation);

        return out;
    },

    // Given a vector in world space, return the vector transformed to screen space
    worldToScreen: function (out, v) {
        const temp = vec3.heap,
            viewport = this.viewport;

        vec3.transformMat4(temp, v, this.worldProjectionMatrix);

        out[0] = Math.round(((temp[0] + 1) / 2) * viewport[2]);
        out[1] = Math.round(((temp[1] + 1) / 2) * viewport[3]);

        return out;
    },

    // Given a vector in screen space, return the vector transformed to world space, projected on the X-Y plane
    screenToWorld: function (out, v) {
        const a = vec3.heap,
            b = vec3.heap2,
            c = vec3.heap3,
            x = v[0],
            y = v[1],
            inverseWorldProjectionMatrix = this.inverseWorldProjectionMatrix,
            viewport = this.viewport;

        // Intersection on the near-plane
        vec3.unproject(a, vec3.set(c, x, y, 0), inverseWorldProjectionMatrix, viewport);

        // Intersection on the far-plane
        vec3.unproject(b, vec3.set(c, x, y, 1), inverseWorldProjectionMatrix, viewport);

        // Intersection on the X-Y plane
        let zIntersection = -a[2] / (b[2] - a[2]);

        vec3.set(out, a[0] + (b[0] - a[0]) * zIntersection, a[1] + (b[1] - a[1]) * zIntersection, 0);

        //console.log(out, a, b, zIntersection)
        return out;
    }
};

mix(Camera.prototype, Node.prototype);
