window["Node"] = function (dontInheritScale) {
    /// <field name="pivot" type="vec3"></param>
    /// <field name="localMatrix" type="mat4"></param>
    /// <field name="localLocation" type="vec3"></param>
    /// <field name="localRotation" type="quat"></param>
    /// <field name="worldMatrix" type="mat4"></param>
    /// <field name="worldLocation" type="vec3"></param>
    /// <field name="worldRotation" type="quat"></param>
    /// <field name="scale" type="vec3"></param>
    /// <field name="inverseScale" type="vec3"></param>
    /// <field name="parent" type="BaseNode"></param>
    /// <field name="dontInheritScale" type="boolean"></param>
    this.pivot = vec3.create();
    this.localMatrix = mat4.create();
    this.localLocation = vec3.create();
    this.localRotation = quat.create();
    this.worldMatrix = mat4.create();
    this.worldLocation = vec3.create();
    this.worldRotation = quat.create();
    this.localScale = vec3.fromValues(1, 1, 1);
    this.worldScale = vec3.create();
    this.inverseWorldScale = vec3.create();
    this.parent = null;
    this.dontInheritScale = dontInheritScale;
}

Node.prototype = {
    setParent: function (parent) {
        this.parent = parent;

        this.recalculateTransformation();
    },

    setLocation: function (location) {
        vec3.copy(this.localLocation, location);

        this.recalculateTransformation();
    },

    setRotation: function (rotation) {
        quat.copy(this.localRotation, rotation);

        this.recalculateTransformation();
    },

    setScale: function (varying) {
        vec3.copy(this.localScale, varying);

        this.recalculateTransformation();
    },

    setUniformScale: function (uniform) {
        vec3.set(this.localScale, uniform, uniform, uniform);

        this.recalculateTransformation();
    },

    set: function (location, rotation, scale) {
        vec3.copy(this.localLocation, location);
        quat.copy(this.localRotation, rotation);
        vec3.copy(this.localScale, scale);

        this.recalculateTransformation();
    },

    recalculateTransformation: function () {
        var localMatrix = this.localMatrix,
            worldMatrix = this.worldMatrix,
            worldLocation = this.worldLocation,
            worldScale = this.worldScale,
            pivot = this.pivot,
            parent = this.parent;
        
        // Local and world matrices
        mat4.fromRotationTranslationScaleOrigin(localMatrix, this.localRotation, this.localLocation, this.localScale, pivot);

        if (parent) {
            mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);

            // If this node shouldn't inherit the parent's scale, scale it by the inverse
            if (this.dontInheritScale) {
                mat4.scale(worldMatrix, worldMatrix, parent.inverseWorldScale);
            }

            // World rotation
            quat.mul(this.worldRotation, parent.worldRotation, this.localRotation); 
        } else {
            mat4.copy(this.worldMatrix, this.localMatrix);
            quat.copy(this.worldRotation, this.localRotation);
        }
        
        // Scale and inverse scale
        mat4.decomposeScale(worldScale, worldMatrix);
        vec3.inverse(this.inverseWorldScale, worldScale);
        
        // Location
        vec3.copy(worldLocation, pivot);
        vec3.transformMat4(worldLocation, worldLocation, worldMatrix);
    },

    move: function (offset) {
        vec3.add(this.localLocation, this.localLocation, offset);

        this.recalculateTransformation();
    },

    rotate: function (rotation) {
        quat.mul(this.localRotation, this.localRotation, rotation);

        this.recalculateTransformation();
    },

    scale: function (varying) {
        vec3.mul(this.localScale, this.localScale, varying);

        this.recalculateTransformation();
    },

    uniformScale: function (uniform) {
        vec3.scale(this.localScale, this.localScale, uniform);

        this.recalculateTransformation();
    }
};
