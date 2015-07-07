/**
 * Used to add spatial capabilities to an object.
 *
 * @mixin
 * @name Spatial
 * @property {mat4} worldMatrix
 * @property {mat4} localMatrix
 * @property {vec3} location
 * @property {quat} rotation
 * @property {vec3} eulerRotation
 * @property {vec3} scaling
 * @property {number} parentId
 * @property {number} attachmentId
 * @property {Node} parentNode
 */
function Spatial() {
    this.localMatrix = mat4.create();
    this.localLocation = vec3.create();
    this.localRotation = quat.create();
    this.worldMatrix = mat4.create();
    this.worldLocation = vec3.create();
    this.worldRotation = quat.create();
    this.scaling = vec3.fromValues(1, 1, 1);
    this.inverseScale = vec3.fromValues(1, 1, 1);
    this.theta = 0;
    this.phi = 0;
    this.parent = null;
}

Spatial.prototype = {
  /**
    * Recalculates the spatial's transformation.
    *
    * @memberof Spatial
    * @instance
    */
    recalculateTransformation: function () {
        var worldMatrix = this.worldMatrix,
            localMatrix = this.localMatrix,
            localRotation = this.localRotation,
            worldLocation = this.worldLocation,
            worldRotation = this.worldRotation,
            scaling = this.scaling,
            parent = this.parent;
        
        mat4.fromRotationTranslationScale(localMatrix, localRotation, this.localLocation, scaling);
        vec3.inverse(this.inverseScale, scaling);
        
        quat.copy(worldRotation, localRotation);
        
        mat4.identity(worldMatrix);

        if (parent) {
            mat4.copy(worldMatrix, parent.getTransformation());
            mat4.scale(worldMatrix, worldMatrix, parent.inverseScale);
            
            quat.mul(worldRotation, worldRotation, parent.worldRotation);
        }

        mat4.multiply(worldMatrix, worldMatrix, localMatrix);
        
        vec3.set(worldLocation, 0, 0, 0);
        vec3.transformMat4(worldLocation, worldLocation, worldMatrix);
    },

  /**
    * Moves a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {vec3} v A displacement vector.
    */
    move: function (v) {
        vec3.add(this.localLocation, this.localLocation, v);
        
        this.recalculateTransformation();
    },

  /**
    * Sets the location of a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {vec3} v A position vector.
    */
    setLocation: function (v) {
        vec3.copy(this.localLocation, v);

        this.recalculateTransformation();
    },

  /**
    * Gets a spatial's location.
    *
    * @memberof Spatial
    * @instance
    * @returns {vec3} The spatial's location.
    */
    getLocation: function () {
        return this.localLocation;
    },
    
  /**
    * Rotates a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {vec3} v A vector of euler angles.
    */
    rotate: function (theta, phi) {
        this.setRotation(this.theta + theta, this.phi + phi);
    },
    
    face: function (location) {
        var sphericalCoordinate = computeSphericalCoordinates(this.worldLocation, location);
        
        this.setRotation(sphericalCoordinate[1] - Math.PI, this.phi);
    },
    
  /**
    * Sets the rotation of a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {quat} v A vector of euler angles.
    */
    setRotation: function (theta, phi) {
        var rotation = this.localRotation;

        this.theta = theta;
        this.phi = phi;
        
        quat.identity(rotation);
        quat.rotateZ(rotation, rotation, theta);
        quat.rotateX(rotation, rotation, phi);

        this.recalculateTransformation();
    },

  /**
    * Gets a spatial's rotation as a vector of euler angles.
    *
    * @memberof Spatial
    * @instance
    * @returns {vec3} The spatial's euler angles.
    */
    getRotation: function () {
        return [this.theta, this.phi];
    },
    
    // Note: shouldn't be used by the client, unless you don't want to use spherical coordinates
    setRotationQuat: function (q) {
        quat.copy(this.localRotation, q);
        
        this.recalculateTransformation();
    },

  /**
    * Scales a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {number} n The scale factor.
    */
    scale: function (n) {
        vec3.scale(this.scaling, this.scaling, n);

        this.recalculateTransformation();
    },

  /**
    * Sets the scale of a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {number} n The scale factor.
    */
    setScale: function (n) {
        vec3.set(this.scaling, n, n, n);

        this.recalculateTransformation();
    },

  /**
    * Gets a spatial's scale.
    *
    * @memberof Spatial
    * @instance
    * @returns {number} The scale factor.
    */
    getScale: function () {
        return this.scaling[0];
    },

    setScaleVector: function (v) {
        vec3.copy(this.scaling, v);

        this.recalculateTransformation();
    },

    getScaleVector: function () {
        return this.scaling;
    },
  
  /**
    * Sets a spatial's parent.
    *
    * @memberof Spatial
    * @instance
    * @param {Node} parent The parent.
    * @param {number} [attahmcnet] An attachment.
    */
    setParent: function (parent) {
        this.parent = parent;
        
        this.recalculateTransformation();
    },
    //~ setParent: function (parent, attachment) {
        //~ if (parent) {
            //~ this.parentId = parent.id;
            //~ this.attachmentId = attachment;

            //~ parent.requestAttachment(this, attachment);
        //~ } else {
            //~ this.parentId = -1;
            //~ this.attachmentId = -1;
            //~ this.parentNode = null;
        //~ }
    //~ },

  // Called from the parent with the parent node.
    setParentNode: function (parent) {
        this.parent = parent;
    },

  /**
    * Gets a spatial's parent.
    *
    * @memberof Spatial
    * @instance
    * @returns {array} The parent and attachment.
    */
    getParent: function () {
        return this.parent;
    },

  /**
    * Gets a spatial's world transformation matrix.
    *
    * @memberof Spatial
    * @instance
    * @returns {mat4} The transformation matrix.
    */
    getTransformation: function () {
        return this.worldMatrix;
    }
};
