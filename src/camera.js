function Camera() {
    this.viewport = vec4.create();

    this.target = vec3.create();
    this.originalTarget = vec3.create();
    this.panVector = vec3.create();

    this.theta = 0;
    this.phi = 0;

    // The first four vector describe a rectangle, the last three describe scale vectors
    this.rect = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)];
    this.billboardedRect = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];
    
    this.heap1 = vec3.create();
    this.heap2 = vec3.create();


    this.horizontalFov = 0.7853981633974483;
    this.aspectRatio = 1;
    this.nearPlane = 1;
    this.farPlane = 100000;

    
    this.worldMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.viewProjMatrix = mat4.create();
    this.worldRotationMatrix = mat4.create();
    this.inverseViewProjMatrix = mat4.create();

    this.location = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);

    this.computeProjectionMatrix();
}

Camera.prototype = {
    computeWorldMatrix: function () {
        var worldMatrix = this.worldMatrix;

        mat4.identity(worldMatrix);
        mat4.translate(worldMatrix, worldMatrix, this.panVector);
        mat4.rotateZ(worldMatrix, worldMatrix, -this.phi);
        mat4.rotateX(worldMatrix, worldMatrix, -this.theta);
        mat4.translate(worldMatrix, worldMatrix, this.target);

        vec3.transformMat4(this.location, vec3.UNIT_Z, worldMatrix);
    },

    computeProjectionMatrix: function () {
        mat4.perspective(this.projectionMatrix, this.horizontalFov, this.aspectRatio, this.nearPlane, this.farPlane);
    },

    computeViewProjMatrix: function () {
        mat4.invert(this.viewMatrix, this.worldMatrix);
        mat4.mul(this.viewProjMatrix, this.projectionMatrix, this.viewMatrix)
        mat4.invert(this.inverseViewProjMatrix, this.viewProjMatrix);
    },

    computeBillboardRect: function () {
        var worldRotationMatrix = this.worldRotationMatrix,
            rect = this.rect,
            billboardedRect = this.billboardedRect;

        mat4.identity(worldRotationMatrix);
        mat4.rotateZ(worldRotationMatrix, worldRotationMatrix, -this.phi);
        mat4.rotateX(worldRotationMatrix, worldRotationMatrix, -this.theta);

        for (i = 0; i < 7; i++) {
            vec3.transformMat4(billboardedRect[i], rect[i], worldRotationMatrix);
        }
    },

    worldMatrixChanged: function () {
        this.computeWorldMatrix();
        this.computeBillboardRect();
        this.computeViewProjMatrix();
    },

    projectionMatrixChanged: function () {
        this.computeProjectionMatrix();
        this.computeViewProjMatrix();
    },
    
    moveLocation: function (offset) {
        var location = this.location;
        
        vec3.add(location, location, offset);
        
        this.set(location, this.target);
    },
    
    moveTarget: function (offset) {
        var target = this.originalTarget;
        
        vec3.add(target, target, offset);
        
        this.set(this.location, target);
    },
    
    // Move both the location and target
    move: function (offset) {
        var target = this.target;
        
        vec3.sub(target, target, offset);
        
        this.worldMatrixChanged();
    },
    
    moveTo: function (target) {
        vec3.negate(this.target, target);
        
        this.worldMatrixChanged();
    },
    
    setLocation: function (location) {
        this.set(location, this.target);
    },
    
    setTarget: function (target) {
        this.set(this.location, target);
    },
    
    // This is equivalent to a look-at matrix, with the up vector implicitly being [0, 0, 1].
    set: function (location, target) {
        var sphericalCoordinate = computeSphericalCoordinates(location, target);
        
        vec3.copy(this.originalTarget, target);
        vec3.negate(this.target, target);
        vec3.set(this.panVector, 0, 0, -sphericalCoordinate[0]);
        
        this.theta = -sphericalCoordinate[2]
        this.phi = -sphericalCoordinate[1] - Math.PI / 2;
        
        this.worldMatrixChanged();
    },
    
    // Move the camera in camera space
    pan: function (pan) {
        var panVector = this.panVector;
        
        vec3.add(panVector, panVector, pan);
        
        this.worldMatrixChanged();
    },
    
    setPan: function (pan) {
        vec3.copy(this.panVector, pan);
        
        this.worldMatrixChanged();
    },
    
    rotate: function (theta, phi) {
        this.theta += theta;
        this.phi += phi;

        this.worldMatrixChanged();
    },
    
    setRotation: function (theta, phi) {
        this.theta = theta;
        this.phi = phi;
        
        this.worldMatrixChanged();
    },
    
    zoom: function (factor) {
        this.panVector[2] *= factor;
        
        this.worldMatrixChanged();
    },
    
    setZoom: function (zoom) {
        this.panVector[2] = zoom;
        
        this.worldMatrixChanged();
    },
    
    setViewport: function (viewport) {
        vec4.copy(this.viewport, viewport);
        
        this.aspectRatio = viewport[2] / viewport[3];
        
        this.projectionMatrixChanged();
    },
    
    // Given a 3D camera space offset, returns a 3D world offset.
    cameraToWorld: function (out, offset) {
        vec3.set(out, offset[0], offset[1], offset[2]);
        vec3.transformMat4(out, out, this.worldRotationMatrix);
        
        return out;
    },
    
    // Given a 2D screen space coordinate, returns its 3D projection on the X-Y plane.
    screenToWorld: function (out, coordinate) {
        var a = this.heap1,
            b = this.heap2,
            x = coordinate[0],
            y = coordinate[1],
            inverseViewProjMatrix = this.inverseViewProjMatrix,
            viewport = this.viewport,
            zIntersection;
        
        vec3.unproject(a, x, y, 0, inverseViewProjMatrix, viewport);
        vec3.unproject(b, x, y, 1, inverseViewProjMatrix, viewport);
        
        zIntersection = -a[2] / (b[2] - a[2]);
        
        vec3.set(out, a[0] + (b[0] - a[0]) * zIntersection, a[1] + (b[1] - a[1]) * zIntersection, 0);
        
        return out;
    },
    
    worldToScreen: function (out, coordinate) {
        var a = this.heap1,
            viewProjMatrix = this.viewProjMatrix,
            viewport = this.viewport;
        
        vec3.transformMat4(a, coordinate, viewProjMatrix);
        
        out[0] = Math.round(((a[0] + 1) / 2) * viewport[2]);
        out[1] = Math.round(((a[1] + 1) / 2) * viewport[3]);
        
        return out;
    }
};
