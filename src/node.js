import glMatrix from './math/gl-matrix-addon';

/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {number} offset
 */
function ViewerNode(buffer, offset) {
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
    /** @member {?ViewerNode} */
    this.parent = null;
    /** @member {Array<ViewerNode>} */
    this.children = [];
    /** @member {boolean} */
    this.dontInheritTranslation = false;
    /** @member {boolean} */
    this.dontInheritRotation = false;
    /** @member {boolean} */
    this.dontInheritScaling = false;
    /** 
     * When a node is a part of a skeleton, it doesn't need the parent's pivot applied to its local matrix.
     * The Skeleton constructor sets this to true for all of its nodes automatically.
     * 
     * @member {boolean}
     */
    this.isSkeletal = false;

    this.localRotation[3] = 1;
    this.localScale.fill(1);

    this.recalculateTransformation();
}

// Used in the constructor above, and in the Skeleton constructor.
// Chances are I'll forget updating one of them when I change stuff, so do it in one place.
ViewerNode.BYTES_PER_ELEMENT = 65 * 4;

ViewerNode.prototype = {
    /**
     * Sets the node's pivot.
     * 
     * @param {vec3} pivot The new pivot.
     * @returns this
     */
    setPivot(pivot) {
        glMatrix.vec3.copy(this.pivot, pivot);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Sets the node's local location.
     * 
     * @param {vec3} location The new location.
     * @returns this
     */
    setLocation(location) {
        glMatrix.vec3.copy(this.localLocation, location);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Sets the node's local rotation.
     * 
     * @param {quat} rotation The new rotation.
     * @returns this
     */
    setRotation(rotation) {
        glMatrix.quat.copy(this.localRotation, rotation);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Sets the node's local scale.
     * 
     * @param {vec3} varying The new scale.
     * @returns this
     */
    setScale(varying) {
        glMatrix.vec3.copy(this.localScale, varying);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Sets the node's local scale uniformly.
     * 
     * @param {number} uniform The new scale.
     * @returns this
     */
    setUniformScale(uniform) {
        glMatrix.vec3.set(this.localScale, uniform, uniform, uniform);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Sets the node's local location, rotation, and scale.
     * 
     * @param {vec3} location The new location.
     * @param {quat} rotation The new rotation.
     * @param {vec3} scale The new scale.
     * @returns this
     */
    setTransformation(location, rotation, scale) {
        let localLocation = this.localLocation,
            localRotation = this.localRotation,
            localScale = this.localScale;

        localLocation[0] = location[0];
        localLocation[1] = location[1];
        localLocation[2] = location[2];
        //glMatrix.vec3.copy(this.localLocation, location);

        localRotation[0] = rotation[0];
        localRotation[1] = rotation[1];
        localRotation[2] = rotation[2];
        localRotation[3] = rotation[3];
        //glMatrix.quat.copy(this.localRotation, rotation);

        localScale[0] = scale[0];
        localScale[1] = scale[1];
        localScale[2] = scale[2];
        //glMatrix.vec3.copy(this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Resets the node's local location, pivot, rotation, and scale, to the default values.
     * 
     * @returns this
     */
    resetTransformation() {
        glMatrix.vec3.copy(this.pivot, glMatrix.vec3.ZERO);
        glMatrix.vec3.copy(this.localLocation, glMatrix.vec3.ZERO);
        glMatrix.quat.copy(this.localRotation, glMatrix.quat.DEFAULT);
        glMatrix.vec3.copy(this.localScale, glMatrix.vec3.ONE);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Moves the node's pivot.
     * 
     * @param {vec3} offset The offset.
     * @returns this
     */
    movePivot(offset) {
        glMatrix.vec3.add(this.pivot, this.pivot, offset);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Moves the node's local location.
     * 
     * @param {vec3} offset The offset.
     * @returns this
     */
    move(offset) {
        glMatrix.vec3.add(this.localLocation, this.localLocation, offset);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Rotates the node's local rotation in world space.
     * 
     * @param {vec3} rotation The rotation.
     * @returns this
     */
    rotate(rotation) {
        glMatrix.quat.mul(this.localRotation, this.localRotation, rotation);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Rotates the node's local rotation in local space.
     * 
     * @param {vec3} rotation The rotation.
     * @returns this
     */
    rotateLocal(rotation) {
        glMatrix.quat.mul(this.localRotation, rotation, this.localRotation);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Scales the node.
     * 
     * @param {vec3} scale The scale.
     * @returns this
     */
    scale(scale) {
        glMatrix.vec3.mul(this.localScale, this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Scales the node uniformly.
     * 
     * @param {number} scale The scale.
     * @returns this
     */
    uniformScale(scale) {
        glMatrix.vec3.scale(this.localScale, this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    lookAt(target) {
        let l = [
            -this.worldLocation[0],
            -this.worldLocation[1],
            -this.worldLocation[2]
        ];

        let t = [
            -target[0],
            -target[1],
            -target[2]
        ];

        let rotation = glMatrix.mat4.getRotation(this.localRotation, glMatrix.mat4.lookAt(glMatrix.mat4.heap, l, t, glMatrix.vec3.UNIT_Y));

        glMatrix.quat.normalize(rotation, rotation)
        //glMatrix.quat.invert(rotation, rotation);

        this.recalculateTransformation();

        return this;
    },

    /**
     * Sets the node's parent.
     * 
     * @param {Node=} parent The parent. NOTE: don't set parent to null manually, instead use setParent().
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
     * Called by this node's parent, when the parent is recalculated.
     * Override this if you want special behavior.
     * Note that ModelInstance overrides this.
     */
    notify() {

    },

    /**
     * Recalculate this node's transformation data.
     */
    recalculateTransformation() {
        let localMatrix = this.localMatrix,
            localLocation = this.localLocation,
            localRotation = this.localRotation,
            localScale = this.localScale,
            worldMatrix = this.worldMatrix,
            worldLocation = this.worldLocation,
            worldRotation = this.worldRotation,
            worldScale = this.worldScale,
            pivot = this.pivot,
            inverseWorldLocation = this.inverseWorldLocation,
            inverseWorldRotation = this.inverseWorldRotation,
            inverseWorldScale = this.inverseWorldScale,
            parent = this.parent,
            children = this.children;

        // World matrix
        // Model space -> World space
        if (parent) {
            let computedLocation,
                computedRotation,
                computedScaling;
            
            if (this.isSkeletal) {
                computedLocation = localLocation;
            } else {
                let parentPivot = parent.pivot;

                computedLocation = glMatrix.vec3.heap;

                computedLocation[0] = localLocation[0] + parentPivot[0];
                computedLocation[1] = localLocation[1] + parentPivot[1];
                computedLocation[2] = localLocation[2] + parentPivot[2];
                //glMatrix.vec3.add(computedLocation, localLocation, parentPivot);
            }

            // If this node shouldn't inherit the parent's rotation, rotate it by the inverse.
            if (this.dontInheritRotation) {
                //glMatrix.mat4.rotateQ(worldMatrix, worldMatrix, parent.inverseWorldRotation);
            }

            // If this node shouldn't inherit the parent's translation, translate it by the inverse.
            if (this.dontInheritTranslation) {
                //glMatrix.mat4.translate(worldMatrix, worldMatrix, parent.inverseWorldLocation);
            }

            if (this.dontInheritScaling) {
                let parentInverseScale = parent.inverseWorldScale;

                computedScaling = glMatrix.vec3.heap2;

                computedScaling[0] = parentInverseScale[0] * localScale[0];
                computedScaling[1] = parentInverseScale[1] * localScale[1];
                computedScaling[2] = parentInverseScale[2] * localScale[2];
                //glMatrix.vec3.mul(computedScaling, parent.inverseWorldScale, localScale);

                worldScale[0] = localScale[0];
                worldScale[1] = localScale[1];
                worldScale[2] = localScale[2];
                //glMatrix.vec3.copy(worldScale, localScale);
            } else {
                computedScaling = localScale;

                let parentScale = parent.worldScale;
                worldScale[0] = parentScale[0] * localScale[0];
                worldScale[1] = parentScale[1] * localScale[1];
                worldScale[2] = parentScale[2] * localScale[2];
                //glMatrix.vec3.mul(worldScale, parentScale, localScale);
            }

            // Local matrix
            // Model space
            glMatrix.mat4.fromRotationTranslationScaleOrigin(localMatrix, localRotation, computedLocation, computedScaling, pivot);

            glMatrix.mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);

            /// TODO: what happens when dontInheritRotation is true?

            // World rotation and inverse world rotation
            glMatrix.quat.mul(worldRotation, parent.worldRotation, localRotation);

            inverseWorldRotation[0] = -worldRotation[0];
            inverseWorldRotation[1] = -worldRotation[1];
            inverseWorldRotation[2] = -worldRotation[2];
            inverseWorldRotation[3] = worldRotation[3];
            //glMatrix.quat.conjugate(inverseWorldRotation, worldRotation);
        } else {
            // Local matrix
            // Model space
            glMatrix.mat4.fromRotationTranslationScaleOrigin(localMatrix, localRotation, localLocation, localScale, pivot);

            worldMatrix[0] = localMatrix[0];
            worldMatrix[1] = localMatrix[1];
            worldMatrix[2] = localMatrix[2];
            worldMatrix[3] = localMatrix[3];
            worldMatrix[4] = localMatrix[4];
            worldMatrix[5] = localMatrix[5];
            worldMatrix[6] = localMatrix[6];
            worldMatrix[7] = localMatrix[7];
            worldMatrix[8] = localMatrix[8];
            worldMatrix[9] = localMatrix[9];
            worldMatrix[10] = localMatrix[10];
            worldMatrix[11] = localMatrix[11];
            worldMatrix[12] = localMatrix[12];
            worldMatrix[13] = localMatrix[13];
            worldMatrix[14] = localMatrix[14];
            worldMatrix[15] = localMatrix[15];
            //glMatrix.mat4.copy(worldMatrix, localMatrix);

            worldRotation[0] = localRotation[0];
            worldRotation[1] = localRotation[1];
            worldRotation[2] = localRotation[2];
            worldRotation[3] = localRotation[3];
            //glMatrix.quat.copy(worldRotation, localRotation);

            inverseWorldRotation[0] = -localRotation[0];
            inverseWorldRotation[1] = -localRotation[1];
            inverseWorldRotation[2] = -localRotation[2];
            inverseWorldRotation[3] = localRotation[3];
            //glMatrix.quat.conjugate(inverseWorldRotation, localRotation);

            worldScale[0] = localScale[0];
            worldScale[1] = localScale[1];
            worldScale[2] = localScale[2];
            //glMatrix.vec3.copy(worldScale, localScale);
        }

        inverseWorldScale[0] = 1 / worldScale[0];
        inverseWorldScale[1] = 1 / worldScale[1];
        inverseWorldScale[2] = 1 / worldScale[2];
        //glMatrix.vec3.inverse(this.inverseWorldScale, worldScale);

        /// TODO: what happens when dontInheritTranslation is true?

        // World location and inverse world location

        worldLocation[0] = pivot[0];
        worldLocation[1] = pivot[1];
        worldLocation[2] = pivot[2];
        //glMatrix.vec3.copy(worldLocation, pivot);

        glMatrix.vec3.transformMat4(worldLocation, worldLocation, worldMatrix);

        inverseWorldLocation[0] = -worldLocation[0];
        inverseWorldLocation[1] = -worldLocation[1];
        inverseWorldLocation[2] = -worldLocation[2];
        //glMatrix.vec3.negate(this.inverseWorldLocation, worldLocation);

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

export default ViewerNode;
