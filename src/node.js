/**
 * @class
 * @classdesc A scene node, that can be moved around and parented to other nodes.
 * @param {boolean} dontInheritScaling True if this node should not inherit the parent's scale when it is parented.
 * @param {?ArrayBuffer} buffer An ArrayBuffer object to add this node to. A new buffer will be created if one isn't given.
 * @param {?number} offset An offset into the buffer, if one was given.
 */
function Node(buffer, offset) {
    if (!buffer) {
        // 65 floats per node.
        buffer = new ArrayBuffer(Node.BYTES_PER_ELEMENT);
        offset = 0;
    }

    if (!(buffer instanceof ArrayBuffer)) {
        throw new TypeError("Node: expected ArrayBuffer, got " + buffer);
    }

    /** @member {vec3} */
    this.pivot = new Float32Array(buffer, offset + 0, 3);
    /** @member {vec3} */
    this.localLocation = new Float32Array(buffer, offset + 12, 3);
    /** @member {quat} */
    this.localRotation = new Float32Array(buffer, offset + 24, 4);
    /** @member {vec3} */
    this.localScale = new Float32Array(buffer, offset + 40, 3);
    /** @member {vec3} */
    this.worldLocation = new Float32Array(buffer, offset + 52, 3);
    /** @member {quat} */
    this.worldRotation = new Float32Array(buffer, offset + 64, 4);
    /** @member {vec3} */
    this.worldScale = new Float32Array(buffer, offset + 80, 3);
    /** @member {vec3} */
    this.inverseWorldLocation = new Float32Array(buffer, offset + 92, 3);
    /** @member {vec4} */
    this.inverseWorldRotation = new Float32Array(buffer, offset + 104, 4);
    /** @member {vec3} */
    this.inverseWorldScale = new Float32Array(buffer, offset + 120, 3);
    /** @member {mat4} */
    this.localMatrix = new Float32Array(buffer, offset + 132, 16);
    /** @member {mat4} */
    this.worldMatrix = new Float32Array(buffer, offset + 196, 16);
    /** @member {?Node} */
    this.parent = null;
    /** @member {Node[]} */
    this.children = [];
    /** @member {boolean} */
    this.dontInheritTranslation = false;
    /** @member {boolean} */
    this.dontInheritRotation = false;
    /** @member {boolean} */
    this.dontInheritScaling = false;

    this.localRotation[3] = 1;
    this.localScale.fill(1);
    mat4.identity(this.worldMatrix);
}

// Used in the constructor above, and in the Skeleton constructor.
// Chances are I'll forget updating one of them when I change stuff, so do it in one place.
Node.BYTES_PER_ELEMENT = 65 * 4;

Node.prototype = {
    /**
     * @method
     * @desc Sets the node's pivot.
     * @param {vec3} pivot The new pivot.
     * @returns this
     */
    setPivot(pivot) {
        vec3.copy(this.pivot, pivot);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Sets the node's local location.
     * @param {vec3} location The new location.
     * @returns this
     */
    setLocation(location) {
        vec3.copy(this.localLocation, location);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Sets the node's local rotation.
     * @param {quat} rotation The new rotation.
     * @returns this
     */
    setRotation(rotation) {
        quat.copy(this.localRotation, rotation);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Sets the node's local scale.
     * @param {vec3} varying The new scale.
     * @returns this
     */
    setScale(varying) {
        vec3.copy(this.localScale, varying);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Sets the node's local scale uniformly.
     * @param {number} uniform The new scale.
     * @returns this
     */
    setUniformScale(uniform) {
        vec3.set(this.localScale, uniform, uniform, uniform);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Sets the node's local location, rotation, and scale.
     * @param {vec3} location The new location.
     * @param {quat} rotation The new rotation.
     * @param {vec3} scale The new scale.
     * @returns this
     */
    setTransformation(location, rotation, scale) {
        vec3.copy(this.localLocation, location);
        quat.copy(this.localRotation, rotation);
        vec3.copy(this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Resets the node's local location, pivot, rotation, and scale, to the default values.
     * @returns this
     */
    resetTransformation() {
        vec3.copy(this.localLocation, vec3.ZERO);
        vec3.copy(this.pivot, vec3.ZERO);
        quat.copy(this.localRotation, quat.DEFAULT);
        vec3.copy(this.localScale, vec3.ONE);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Moves the node's pivot.
     * @param {vec3} offset The offset.
     * @returns this
     */
    movePivot(offset) {
        vec3.add(this.pivot, this.pivot, offset);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Moves the node's local location.
     * @param {vec3} offset The offset.
     * @returns this
     */
    move(offset) {
        vec3.add(this.localLocation, this.localLocation, offset);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Rotates the node's local rotation in world space.
     * @param {vec3} rotation The rotation.
     * @returns this
     */
    rotate(rotation) {
        quat.mul(this.localRotation, this.localRotation, rotation);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Rotates the node's local rotation in local space.
     * @param {vec3} rotation The rotation.
     * @returns this
     */
    rotateLocal(rotation) {
        quat.mul(this.localRotation, rotation, this.localRotation);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Scales the node.
     * @param {vec3} scale The scale.
     * @returns this
     */
    scale(scale) {
        vec3.mul(this.localScale, this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Scales the node uniformly.
     * @param {number} scale The scale.
     * @returns this
     */
    uniformScale(scale) {
        vec3.scale(this.localScale, this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Sets the node's parent.
     * @param {?Node} parent The parent. NOTE: don't set parent to null manually, instead use setParent(null).
     * @returns this
     */
    setParent(parent) {
        if (this.parent) {
            this.parent.removeChild(this);
        }

        this.parent = parent;

        if (parent) {
            parent.addChild(this);
        }

        this.recalculateTransformation();

        return this;
    },

    /**
     * @method
     * @desc Called by this node's parent, when the parent is recalculated.
     *       Override this if you want special behavior.
     *       Note that ModelInstance overrides this.
     * @returns {vec3}
     */
    notify() {

    },

    /**
     * @method
     * @desc Get the node's world location.
     * @returns {vec3}
     */
    getLocation() {
        return this.worldLocation;
    },

    /**
     * @method
     * @desc Get the node's world rotation.
     * @returns {quat}
     */
    getRotation() {
        return this.worldRotation;
    },

    /**
     * @method
     * @desc Get the node's world scale.
     * @returns {vec3}
     */
    getScaling() {
        return this.worldScale;
    },

    /**
     * @method
     * @desc Recalculate this node's transformation data.
     */
    recalculateTransformation() {
        let localMatrix = this.localMatrix,
            localRotation = this.localRotation,
            worldMatrix = this.worldMatrix,
            worldLocation = this.worldLocation,
            worldRotation = this.worldRotation,
            worldScale = this.worldScale,
            pivot = this.pivot,
            inverseWorldRotation = this.inverseWorldRotation,
            parent = this.parent,
            children = this.children;

        // Local matrix
        // Model space
        mat4.fromRotationTranslationScaleOrigin(localMatrix, localRotation, this.localLocation, this.localScale, pivot);

        // World matrix
        // Model space -> World space
        if (parent) {
            let heap = mat4.heap;

            mat4.copy(heap, parent.worldMatrix);

            // If this node shouldn't inherit the parent's rotation, rotation it by the inverse
            if (this.dontInheritRotation) {
                mat4.rotate(heap, heap, parent.inverseWorldRotation);
            }

            // If this node shouldn't inherit the parent's scale, scale it by the inverse
            if (this.dontInheritScaling) {
                mat4.scale(heap, heap, parent.inverseWorldScale);
            }

            // If this node shouldn't inherit the parent's translation, translate it by the inverse
            if (this.dontInheritTranslation) {
                mat4.translate(heap, heap, parent.inverseWorldLocation);
            }

            mat4.mul(worldMatrix, heap, localMatrix);

            //mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);
            /*
            // If this node shouldn't inherit the parent's rotation, rotation it by the inverse
            if (this.dontInheritRotation) {
                mat4.rotate(worldMatrix, worldMatrix, parent.inverseWorldRotation);
            }

            // If this node shouldn't inherit the parent's scale, scale it by the inverse
            if (this.dontInheritScaling) {
                mat4.scale(worldMatrix, worldMatrix, parent.inverseWorldScale);
            }

            // If this node shouldn't inherit the parent's translation, translate it by the inverse
            if (this.dontInheritTranslation) {
                mat4.translate(worldMatrix, worldMatrix, parent.inverseWorldLocation);
            }
            */

            // World rotation and inverse world rotation
            quat.mul(worldRotation, parent.worldRotation, localRotation);
            quat.conjugate(inverseWorldRotation, worldRotation);
        } else {
            mat4.copy(worldMatrix, localMatrix);
            quat.copy(worldRotation, localRotation);
            quat.conjugate(inverseWorldRotation, localRotation);
        }

        // Scale and inverse scale
        mat4.getScaling(worldScale, worldMatrix);
        vec3.inverse(this.inverseWorldScale, worldScale);

        // World location and inverse world location
        vec3.copy(worldLocation, pivot);
        vec3.transformMat4(worldLocation, worldLocation, worldMatrix);
        vec3.negate(this.inverseWorldLocation, worldLocation);

        // Notify the children
        for (let i = 0, l = children.length; i < l; i++) {
            children[i].notify();
        }

        return this;
    },

    addChild(child) {
        this.children.push(child);
    },

    removeChild(child) {
        let children = this.children,
            index = children.indexOf(child);

        if (index !== -1) {
            children.splice(index, 1);
        }
    }
};
