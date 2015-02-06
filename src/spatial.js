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
    this.worldMatrix = mat4.create();
    this.localMatrix = mat4.create();
    this.location = vec3.create();
    this.worldLocation = vec3.create();
    this.rotation = quat.create();
    this.theta = 0;
    this.phi = 0;
    this.scaling = vec3.fromValues(1, 1, 1);
    this.inverseScale = vec3.create();
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
        mat4.fromRotationTranslationScale(this.localMatrix, this.rotation, this.location, this.scaling);
        vec3.inverse(this.inverseScale, this.scaling);
    },

  /**
    * Moves a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {vec3} v A displacement vector.
    */
    move: function (v) {
        vec3.add(this.location, this.location, v);
        
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
        vec3.copy(this.location, v);

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
        return Array.copy(this.location);
    },
    
  /**
    * Rotates a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {vec3} v A vector of euler angles.
    */
    rotate: function (theta, phi) {
        this.theta += theta;
        this.phi += phi;

        this.setRotation(this.theta, this.phi);
    },

  /**
    * Sets the rotation of a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {quat} v A vector of euler angles.
    */
    setRotation: function (theta, phi) {
        var rotation = this.rotation;

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
        // Note: no Array.copy because this is a function for internal use, and I don't want garbage collection.
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
        var worldMatrix = this.worldMatrix,
            parent = this.parent;

        mat4.identity(worldMatrix);

        if (parent) {
            mat4.copy(worldMatrix, parent.getTransformation());

            // Scale by the inverse of the parent to avoid carrying over scales through the hierarchy
            mat4.scale(worldMatrix, worldMatrix, parent.inverseScale);
        }

        mat4.multiply(worldMatrix, worldMatrix, this.localMatrix);

        return worldMatrix;
    },
    
    getWorldLocation: function () {
        var worldMatrix = this.getTransformation(),
            worldLocation = this.worldLocation;
        
        vec3.set(worldLocation, 0, 0, 0);
        vec3.transformMat4(worldLocation, worldLocation, worldMatrix);
        
        return worldLocation;
    }
};