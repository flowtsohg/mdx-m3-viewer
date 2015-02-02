function Camera(size) {
    this.viewport = [0, 0, size[0], size[1]];
    this.size = size;
    this.fov = 0.7853981633974483;
    this.aspect = size[0] / size[1];
    this.near = 0.1;
    this.far = 100000;
    this.projection = mat4.create();
    this.location = vec3.create();
    this.target = vec3.create();
    this.originalTarget = vec3.create();
    this.panVector = vec3.create();
    this.view = mat4.create();
    this.viewProjection = mat4.create();
    this.inverseViewProjection = mat4.create();
    this.inverseView = mat4.create();
    this.inverseRotation = mat4.create();
    this.theta = 0;
    this.phi = 0;
    // The first four vector describe a rectangle, the last three describe scale vectors
    this.rect = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)];
    this.billboardedRect = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];
    this.dirty = true;
    
    this.heap1 = vec3.create();
    this.heap2 = vec3.create();
    
    this.reset();
}

Camera.prototype = {
    reset: function () {
        vec3.set(this.panVector, 0, 0, -300);
        vec3.set(this.target, 0, 0, 0);
        vec3.set(this.originalTarget, 0, 0, 0);
        
        this.theta = 5.5;
        this.phi = 4;  
        
        this.dirty = true;
    },
    
    update: function () {
        if (this.dirty) {
            var view = this.view,
                projection = this.projection,
                viewProjection = this.viewProjection,
                location = this.location,
                inverseView = this.inverseView,
                inverseRotation = this.inverseRotation,
                theta = this.theta,
                phi = this.phi,
                rect = this.rect,
                billboardedRect = this.billboardedRect,
                i;
            
            mat4.perspective(projection, this.fov, this.aspect, this.near, this.far);
            
            mat4.identity(view);
            mat4.translate(view, view, this.panVector);
            mat4.rotate(view, view, theta, vec3.UNIT_X);
            mat4.rotate(view, view, phi, vec3.UNIT_Z);
            mat4.translate(view, view, this.target);
            
            mat4.multiply(viewProjection, projection, view);
            mat4.invert(this.inverseViewProjection, viewProjection);
            
            mat4.identity(inverseRotation);
            mat4.rotate(inverseRotation, inverseRotation, -phi, vec3.UNIT_Z);
            mat4.rotate(inverseRotation, inverseRotation, -theta, vec3.UNIT_X);

            mat4.invert(inverseView, view);
            vec3.transformMat4(location, vec3.UNIT_Z, inverseView);
            
            for (i = 0; i < 7; i++) {
                vec3.transformMat4(billboardedRect[i], rect[i], inverseRotation);
            }
            
            this.dirty = false;
            
            return true;
        }
        
        return false;
    },
    
    moveLocation: function (offset) {
        var location = this.location;
        
        vec3.add(location, location, offset);
        
        this.set(location, this.target);
        
        this.dirty = true;
    },
    
    moveTarget: function (offset) {
        var target = this.originalTarget;
        
        vec3.add(target, target, offset);
        
        this.set(this.location, target);
        
        this.dirty = true;
    },
    
    // Move both the location and target
    move: function (offset) {
        var target = this.target;
        
        vec3.sub(target, target, offset);
        
        this.dirty = true;
    },
    
    setLocation: function (location) {
        this.set(location, this.target);
        
        this.dirty = true;
    },
    
    setTarget: function (target) {
        this.set(this.location, target);
        
        this.dirty = true;
    },
    
    // This is equivalent to a look-at matrix, with the up vector implicitly being [0, 0, 1].
    set: function (location, target) {
        var sphericalCoordinate = computeSphericalCoordinates(location, target);
        
        vec3.copy(this.originalTarget, target);
        vec3.negate(this.target, target);
        vec3.set(this.panVector, 0, 0, -sphericalCoordinate[0]);
        
        this.theta = -sphericalCoordinate[2]
        this.phi = -sphericalCoordinate[1] - Math.PI / 2;
        
        this.dirty = true;
    },
    
    // Pan the camera in camera space
    pan: function (offset) {
        var panVector = this.panVector;
        
        if (offset.length === 2) {
            vec2.add(panVector, panVector, offset);
        } else {
            vec3.add(panVector, panVector, offset);
        }
        
        this.dirty = true;
    },
    
    setPan: function (pan) {
       var panVector = this.panVector;
        
        if (offset.length === 2) {
            vec2.copy(panVector, offset);
        } else {
            vec3.copy(panVector, offset);
        }
        
        this.dirty = true;
    },
    
    rotate: function (theta, phi) {
        this.theta += theta;
        this.phi += phi;
        
        this.dirty = true;
    },
    
    zoom: function (factor) {
        this.panVector[2] *= factor;
        
        this.dirty = true;
    },
    
    setFov: function (fov) {
        this.fov = fov;
        
        this.dirty = true;
    },
    
    setAspect: function (aspect) {
        this.aspect = aspect;
        
        this.dirty = true;
    },
    
    setNearPlane: function (near) {
        this.near = near;
        
        this.dirty = true;
    },
    
    setFarPlane: function (far) {
        this.far = far;
        
        this.dirty = true;
    },
    
    setSize: function (size) {
        this.viewport[2] = size[0];
        this.viewport[3] = size[1];
        this.size = size;
        this.aspect = size[0] / size[1];
        
        this.dirty = true;
    },
    
    // Given a 2D camera space offset, returns a 3D world offset.
    cameraToWorld: function (out, offset) {
        vec3.set(out, offset[0], offset[1], 0);
        vec3.transformMat4(out, out, this.inverseRotation);
        
        return out;
    },
    
    // Given a 2D screen space coordinate, returns its 3D projection on the X-Y plane.
    screenToWorld: function (out, coordinate) {
        var a = this.heap1,
            b = this.heap2,
            x = coordinate[0],
            y = coordinate[1],
            inverseViewProjection = this.inverseViewProjection,
            viewport = this.viewport,
            zIntersection;
        
        vec3.unproject(a, x, y, 0, inverseViewProjection, viewport);
        vec3.unproject(b, x, y, 1, inverseViewProjection, viewport);
        
        zIntersection = -a[2] / (b[2] - a[2]);
        
        vec3.set(out, a[0] + (b[0] - a[0]) * zIntersection, a[1] + (b[1] - a[1]) * zIntersection, 0);
        
        return out;
    }
};