M3.ShallowBone = function (bone) {
    Node.call(this);

    this.boneImpl = bone;
    this.parentId = bone.parent;
    
    this.externalWorldMatrix = mat4.create();
};

M3.ShallowBone.prototype = extend(Node.prototype, {
    getTransformation: function () {
        var m = this.externalWorldMatrix;

        mat4.copy(m, this.worldMatrix);
        // Remove the local rotation as far as external objects know
        mat4.rotateZ(m, m, -Math.PI / 2);

        return m;
    }
});

M3.Skeleton = function (asyncInstance, model, ctx) {
    var i, l;
    var bones = model.bones;
    var boneLookup = model.boneLookup;

    this.initialReference = model.initialReference;
    this.sts = model.sts;
    this.stc = model.stc;
    this.stg = model.stg;

    this.boneLookup = boneLookup;

    BaseSkeleton.call(this, boneLookup.length, ctx);

    for (i = 0, l = bones.length; i < l; i++) {
        this.nodes[i] = new M3.ShallowBone(bones[i]);
    }

    // Set the bone parent references
    for (var i = 0, l = bones.length; i < l; i++) {
        this.nodes[i].setParent(this.getNode(this.nodes[i].parentId));
    }

    this.localMatrix = mat4.create();
    this.rotationMatrix = mat4.create();

    this.locationVec = vec3.create();
    this.scaleVec = vec3.create();
    this.rotationQuat = quat.create();

    // The following code parents the root of this skeleton to the parent instance, and transforms it to approximately match the scale and angle of MDX models.

    this.rootNode.setParent(asyncInstance);

    this.rootNode.uniformScale(100);

    quat.setAxisAngle(this.rotationQuat, vec3.UNIT_Z, Math.PI / 2);
    this.rootNode.rotate(this.rotationQuat);
};

M3.Skeleton.prototype = extend(BaseSkeleton.prototype, {
    update: function (sequence, frame, ctx) {
        for (var i = 0, l = this.nodes.length; i < l; i++) {
            this.updateBone(this.nodes[i], sequence, frame);
        }

        this.updateHW(sequence, ctx);
    },

    getValue: function (out, animRef, sequence, frame) {
        if (sequence !== -1) {
            return this.stg[sequence].getValue(out, animRef, frame)
        }

        return animRef.initValue;
    },

    updateBone: function (bone, sequence, frame) {
        var location = this.getValue(this.locationVec, bone.boneImpl.location, sequence, frame);
        var rotation = this.getValue(this.rotationQuat, bone.boneImpl.rotation, sequence, frame);
        var scale = this.getValue(this.scaleVec, bone.boneImpl.scale, sequence, frame);
        
        bone.set(location, rotation, scale);
    },

    updateHW: function (sequence, ctx) {
        var bones = this.nodes;
        var hwbones = this.hwbones;
        var initialReferences = this.initialReference;
        var boneLookup = this.boneLookup;
        var bone;
        var finalMatrix;

        if (sequence === -1) {
            finalMatrix = this.rootNode.worldMatrix;
        } else {
            finalMatrix = this.localMatrix;
        }

        for (var i = 0, l = boneLookup.length; i < l; i++) {
            if (sequence !== -1) {
                bone = boneLookup[i];
                mat4.multiply(finalMatrix, bones[bone].worldMatrix, initialReferences[bone]);
            } 

            hwbones.set(finalMatrix, i * 16);
        }

        this.updateBoneTexture(ctx);
    }
});
