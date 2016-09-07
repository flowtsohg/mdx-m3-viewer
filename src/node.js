function Node(dontInheritScale, buffer, offset) {
    if (!buffer) {
        buffer = new ArrayBuffer(58 * 4);
        offset = 0;
    }

    this.pivot = new Float32Array(buffer, offset + 0, 3);
    this.localLocation = new Float32Array(buffer, offset + 12, 3);
    this.localRotation = new Float32Array(buffer, offset + 24, 4);
    this.localScale = new Float32Array(buffer, offset + 40, 3);
    this.worldLocation = new Float32Array(buffer, offset + 52, 3);
    this.worldRotation = new Float32Array(buffer, offset + 64, 4);
    this.worldScale = new Float32Array(buffer, offset + 80, 3);
    this.inverseWorldScale = new Float32Array(buffer, offset + 92, 3);
    this.localMatrix = new Float32Array(buffer, offset + 104, 16);
    this.worldMatrix = new Float32Array(buffer, offset + 168, 16);
    this.parent = null;
    this.dontInheritScale = dontInheritScale || false;

    this.localRotation[3] = 1;
    this.localScale.fill(1);
    mat4.identity(this.worldMatrix);
}

Node.prototype = {
    setPivot(pivot) {
        vec3.copy(this.pivot, pivot);

        this.recalculateTransformation();

        return this;
    },

    setLocation(location) {
        vec3.copy(this.localLocation, location);

        this.recalculateTransformation();

        return this;
    },

    setRotation(rotation) {
        quat.copy(this.localRotation, rotation);

        this.recalculateTransformation();

        return this;
    },

    setScale(varying) {
        vec3.copy(this.localScale, varying);

        this.recalculateTransformation();

        return this;
    },

    setUniformScale(uniform) {
        vec3.set(this.localScale, uniform, uniform, uniform);

        this.recalculateTransformation();

        return this;
    },

    setTransformation(location, rotation, scale) {
        vec3.copy(this.localLocation, location);
        quat.copy(this.localRotation, rotation);
        vec3.copy(this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    movePivot(offset) {
        vec3.add(this.pivot, this.pivot, offset);

        this.recalculateTransformation();

        return this;
    },

    move(offset) {
        vec3.add(this.localLocation, this.localLocation, offset);

        this.recalculateTransformation();

        return this;
    },

    rotate(rotation) {
        quat.mul(this.localRotation, this.localRotation, rotation);

        this.recalculateTransformation();

        return this;
    },

    rotateLocal(rotation) {
        quat.mul(this.localRotation, rotation, this.localRotation);

        this.recalculateTransformation();

        return this;
    },

    scale(scale) {
        vec3.mul(this.localScale, this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    uniformScale(scale) {
        vec3.scale(this.localScale, this.localScale, scale);

        this.recalculateTransformation();

        return this;
    },

    setParent(parent) {
        this.parent = parent;

        this.recalculateTransformation();

        return this;
    },

    getLocation() {
        return this.worldLocation;
    },

    getRotation() {
        return this.worldRotation;
    },

    getScale() {
        return this.worldScale;
    },

    recalculateTransformation() {
        const localMatrix = this.localMatrix,
            localRotation = this.localRotation,
            worldMatrix = this.worldMatrix,
            worldLocation = this.worldLocation,
            worldRotation = this.worldRotation,
            worldScale = this.worldScale,
            pivot = this.pivot,
            parent = this.parent;

        // Local matrix
        // Model space
        mat4.fromRotationTranslationScaleOrigin(localMatrix, localRotation, this.localLocation, this.localScale, pivot);

        // World matrix
        // Model space -> World space
        if (parent) {
            mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);

            // If this node shouldn't inherit the parent's scale, scale it by the inverse
            if (this.dontInheritScale) {
                mat4.scale(worldMatrix, worldMatrix, parent.inverseWorldScale);
            }

            // World rotation
            quat.mul(worldRotation, parent.worldRotation, localRotation);
        } else {
            mat4.copy(worldMatrix, localMatrix);
            quat.copy(worldRotation, localRotation);
        }

        // Scale and inverse scale
        mat4.decomposeScale(worldScale, worldMatrix);
        vec3.inverse(this.inverseWorldScale, worldScale);

        // World location
        vec3.copy(worldLocation, pivot);
        vec3.transformMat4(worldLocation, worldLocation, worldMatrix);
    }
};
