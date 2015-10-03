window["BaseNode"] = function () {
    /// <field name="pivot" type="vec3"></param>
    /// <field name="localMatrix" type="mat4"></param>
    /// <field name="localLocation" type="vec3"></param>
    /// <field name="localRotation" type="quat"></param>
    /// <field name="worldMatrix" type="mat4"></param>
    /// <field name="worldLocation" type="vec3"></param>
    /// <field name="worldRotation" type="quat"></param>
    /// <field name="scale" type="vec3"></param>
    /// <field name="inverseScale" type="vec3"></param>
    this.pivot = vec3.create();
    this.localMatrix = mat4.create();
    this.localLocation = vec3.create();
    this.localRotation = quat.create();
    this.worldMatrix = mat4.create();
    this.worldLocation = vec3.create();
    this.worldRotation = quat.create();
    this.scale = vec3.create();
    this.inverseScale = vec3.create();
    this.dirty = false;
}

BaseNode.prototype = {
    // Copies the needed parameters from the parent
    setFromParent: function (parent) {
        var scale = this.scale;
        
        mat4.copy(this.worldMatrix, parent.worldMatrix);
        mat4.decomposeScale(scale, parent.worldMatrix);
        vec3.inverse(this.inverseScale, scale);
        vec3.copy(this.worldLocation, parent.worldLocation);
        quat.copy(this.worldRotation, parent.worldRotation);
    },

    // Updates this node with the parent world space values, and the local space arguments
    update: function (parent, rotation, translation, scale) {
        var localMatrix = this.localMatrix,
            worldMatrix = this.worldMatrix,
            worldLocation = this.worldLocation,
            selfScale = this.scale,
            pivot = this.pivot;
        
        // Local and world matrices
        mat4.fromRotationTranslationScaleOrigin(localMatrix, rotation, translation, scale, pivot);
        mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);
        
        //// Scale and inverse scale
        //mat4.decomposeScale(selfScale, worldMatrix);
        //vec3.inverse(this.inverseScale, selfScale);
        
        //// Local location and rotation
        vec3.copy(this.localLocation, translation);
        quat.copy(this.localRotation, rotation);
        
        //// World location
        //vec3.copy(worldLocation, pivot);
        //vec3.transformMat4(worldLocation, worldLocation, worldMatrix);
        
        //// World rotation
        //quat.mul(this.worldRotation, parent.worldRotation, rotation);
    }
    /*
    update: function (parent, rotation, translation, scale) {
        var localMatrix = this.localMatrix,
            localLocation = this.localLocation,
            localRotation = this.localRotation,
            worldMatrix = this.worldMatrix,
            worldLocation = this.worldLocation,
            selfScale = this.scale,
            pivot = this.pivot;
        
        var dirty = parent.dirty;

        if (localRotation[0] == rotation[0] && localRotation[1] == rotation[1] && localRotation[2] == rotation[2] && localRotation[3] == rotation[3] &&
            localLocation[0] == translation[0] && localLocation[1] == translation[1] && localLocation[2] == translation[2]) {
            //)
            SKIPPED_LOCAL_UPDATES++;
        } else {
        //if (vec3.compare(localRotation, rotation) || vec3.compare(localLocation, translation)) {
            dirty = true;

            mat4.fromRotationTranslationScaleOrigin(localMatrix, rotation, translation, scale, pivot);
            vec3.copy(this.localLocation, translation);
            quat.copy(this.localRotation, rotation);
        }
            // Local and world matrices
        
        this.dirty = dirty;

        if (dirty) {
            
            mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);
        } else {
            SKIPPED_GLOBAL_UPDATES++;
        }
        
            //// Scale and inverse scale
            //mat4.decomposeScale(selfScale, worldMatrix);
            //vec3.inverse(this.inverseScale, selfScale);
        
            //// Local location and rotation
            //vec3.copy(this.localLocation, translation);
            //quat.copy(this.localRotation, rotation);
        
            //// World location
            //vec3.copy(worldLocation, pivot);
            //vec3.transformMat4(worldLocation, worldLocation, worldMatrix);
        
            //// World rotation
            //quat.mul(this.worldRotation, parent.worldRotation, rotation);
    }
    //*/
};