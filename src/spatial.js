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
    this.rotation = quat.create();
    this.eulerRotation = vec3.create();
    this.scaling = vec3.fromValues(1, 1, 1);
    this.parentId = -1;
    this.attachmentId = -1;
    this.parentNode = null;
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
    * @param {quat} q A quaternion.
    */
    rotateQuat: function (q) {
        quat.multiply(this.rotation, this.rotation, q);

        this.recalculateTransformation();
    },

  /**
    * Sets the rotation of a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {quat} q A quaternion.
    */
    setRotationQuat: function (q) {
        quat.copy(this.rotation, q);

        this.recalculateTransformation();
    },

  /**
    * Gets a spatial's rotation as a quaternion.
    *
    * @memberof Spatial
    * @instance
    * @returns {quat} The spatial's quaternion rotation.
    */
    getRotationQuat: function () {
        return Array.copy(this.rotation);
    },

  /**
    * Rotates a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {vec3} v A vector of euler angles.
    */
    rotate: function (v) {
        var eulerRotation = this.eulerRotation;

        vec3.add(eulerRotation, eulerRotation, v);

        this.setRotation(eulerRotation);
    },

  /**
    * Sets the rotation of a spatial.
    *
    * @memberof Spatial
    * @instance
    * @param {quat} v A vector of euler angles.
    */
    setRotation: function (v) {
        var q = quat.create(),
             rotation = this.rotation,
            eulerRotation = this.eulerRotation;

        vec3.copy(eulerRotation, v);

        quat.identity(rotation);

        quat.setAxisAngle(q, vec3.UNIT_X, eulerRotation[0]);
        quat.multiply(rotation, q, rotation);

        quat.setAxisAngle(q, vec3.UNIT_Y, eulerRotation[1]);
        quat.multiply(rotation, q, rotation);

        quat.setAxisAngle(q, vec3.UNIT_Z, eulerRotation[2]);
        quat.multiply(rotation, q, rotation);

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
        return vec3.clone(this.eulerRotation);
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
    setParent: function (parent, attachment) {
        if (parent) {
            this.parentId = parent.id;
            this.attachmentId = attachment;

            parent.requestAttachment(this, attachment);
        } else {
            this.parentId = -1;
            this.attachmentId = -1;
            this.parentNode = null;
        }
    },

  // Called from the parent with the parent node.
    setParentNode: function (node) {
        this.parentNode = node;
    },

  /**
    * Gets a spatial's parent.
    *
    * @memberof Spatial
    * @instance
    * @returns {array} The parent and attachment.
    */
    getParent: function () {
        return [this.parentId, this.attachmentId];
    },

  /**
    * Gets a spatial's world transformation matrix.
    *
    * @memberof Spatial
    * @instance
    * @returns {mat4} The transformation matrix.
    */
    getTransformation: function (objects) {
        var worldMatrix = this.worldMatrix,
            parentNode = this.parentNode;

        mat4.identity(worldMatrix);

        if (parentNode) {
            mat4.copy(worldMatrix, parentNode.getTransformation());

            // Scale by the inverse of the parent to avoid carrying over scales through the hierarchy
            mat4.scale(worldMatrix, worldMatrix, parentNode.inverseScale);
        }

        mat4.multiply(worldMatrix, worldMatrix, this.localMatrix);

        return worldMatrix;
    }
};