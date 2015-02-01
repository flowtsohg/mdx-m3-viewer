function Camera() {
    this.fov = Math.toRad(45);
    this.aspect = 1;
    this.near = 0.1;
    this.far = 1000000;
    this.projection = mat4.create();
    this.instance = null;
    this.location = vec3.create();
    this.target = vec3.create();
    this.originalTarget = vec3.create();
    this.panOffset = vec3.create();
    this.view = mat4.create();
    this.inverseView = mat4.create();
    this.inverseRotation = mat4.create();
    this.theta = 0;
    this.phi = 0;
    // The first four vector describe a rectangle, the last three describe scale vectors
    this.rect = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)];
    this.billboardedRect = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];
    this.dirty = true;
    
    this.reset();
}

Camera.prototype = {
    reset: function () {
        vec3.set(this.panOffset, 0, 0, -300);
        vec3.set(this.target, 0, 0, 0);
        vec3.set(this.originalTarget, 0, 0, 0);
        
        this.theta = 5.5;
        this.phi = 4;  
        
        this.dirty = true;
    },
    
    update: function () {
        if (this.dirty || this.instance) {
            var view = this.view,
                location = this.location,
                inverseView = this.inverseView,
                inverseRotation = this.inverseRotation,
                theta = this.theta,
                phi = this.phi,
                rect = this.rect,
                billboardedRect = this.billboardedRect,
                i;
            
            mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
            
            mat4.identity(view);
            mat4.translate(view, view, this.panOffset);
            mat4.rotate(view, view, theta, vec3.UNIT_X);
            mat4.rotate(view, view, phi, vec3.UNIT_Z);
            
            if (this.instance) {
                mat4.translate(view, view, this.instance.getInverseWorldLocation());
            } else {
                mat4.translate(view, view, this.target);
            }
            
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
    
    set: function (location, target) {
        var sphericalCoordinate = computeSphericalCoordinates(location, target);
        
        vec3.copy(this.originalTarget, target);
        vec3.negate(this.target, target);
        vec3.set(this.panOffset, 0, 0, -sphericalCoordinate[0]);
        
        this.theta = -sphericalCoordinate[2]
        this.phi = -sphericalCoordinate[1] - Math.PI / 2;
        
        this.dirty = true;
    },
    
    // Pan the camera in camera space
    pan: function (offset) {
        var panOffset = this.panOffset;
        
        if (offset.length === 2) {
            vec2.add(panOffset, panOffset, offset);
        } else {
            vec3.add(panOffset, panOffset, offset);
        }
        
        this.dirty = true;
    },
    
    setPan: function (pan) {
       var panOffset = this.panOffset;
        
        if (offset.length === 2) {
            vec2.copy(panOffset, offset);
        } else {
            vec3.copy(panOffset, offset);
        }
        
        this.dirty = true;
    },
    
    rotate: function (theta, phi) {
        this.theta += theta;
        this.phi += phi;
        
        this.dirty = true;
    },
    
    zoom: function (factor) {
        this.panOffset[2] *= factor;
        
        this.dirty = true;
    },
    
    // Attach the camera to an instance.
    // The camera's target will be the instance's location, and it will follow the instance.
    // To free the camera, call attach with null.
    attach: function (instance) {
        this.instance = instance;
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
    }
};