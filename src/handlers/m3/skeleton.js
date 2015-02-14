function ShallowBone (bone) {
    BaseNode.call(this);

    this.boneImpl = bone;
    this.parent = bone.parent;
    
    this.externalWorldMatrix = mat4.create();
}

ShallowBone.prototype = extend(BaseNode.prototype, {
    getTransformation: function () {
        var m = this.externalWorldMatrix;

        mat4.copy(m, this.worldMatrix);
        // Remove the local rotation as far as external objects know
        mat4.rotateZ(m, m, -Math.PI / 2);

        return m;
    }
});

function Skeleton(model, ctx) {
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
        this.nodes[i] = new ShallowBone(bones[i]);
    }

    this.localMatrix = mat4.create();
    this.rotationMatrix = mat4.create();

    this.locationVec = vec3.create();
    this.scaleVec = vec3.create();
    this.rotationQuat = quat.create();

    this.rootScaler = vec3.fromValues(100, 100, 100);
}

Skeleton.prototype = extend(BaseSkeleton.prototype, {
    update: function (sequence, frame, instance, ctx) {
        var root = this.rootNode;

        mat4.copy(root.worldMatrix, instance.worldMatrix);

        // Transform the skeleton to approximately match the size of Warcraft 3 models, and to have the same rotation
        mat4.scale(root.worldMatrix, root.worldMatrix, this.rootScaler);
        mat4.rotateZ(root.worldMatrix, root.worldMatrix, Math.PI / 2);

        mat4.decomposeScale(root.scale, root.worldMatrix);
        vec3.inverse(root.inverseScale, root.scale);

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
        var parent = this.getNode(bone.parent);
        var location = this.getValue(this.locationVec, bone.boneImpl.location, sequence, frame);
        var rotation = this.getValue(this.rotationQuat, bone.boneImpl.rotation, sequence, frame);
        var scale = this.getValue(this.scaleVec, bone.boneImpl.scale, sequence, frame);
        
        bone.update(parent, rotation, location, scale);
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