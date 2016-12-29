function M3Skeleton(instance) {
    const model = instance.model,
        bones = model.bones,
        boneLookup = model.boneLookup;

    Skeleton.call(this, instance, bones.length);

    // Transform M3 skeletons so they match the viewer's coordinate system.
    this.rootNode.uniformScale(100);
    this.rootNode.rotate(quat.setAxisAngle(quat.heap, vec3.UNIT_X, -Math.PI / 2));

    this.instance = instance;
    this.modelNodes = bones;
    this.initialReference = model.initialReference;
    this.sts = model.sts;
    this.stc = model.stc;
    this.stg = model.stg;
    this.boneLookup = boneLookup;
    
    // Set the bone parent references
    for (var i = 0, l = bones.length; i < l; i++) {
        this.nodes[i].setParent(this.getNode(bones[i].parent));

        this.nodes[i].inverseBasisMatrix = M3.inverseBasisMatrix;
    }

    this.boneArray = null;
}

M3Skeleton.prototype = {
    update() {
        let instance = this.instance,
            nodes = this.nodes,
            modelNodes = this.modelNodes;

        for (let i = 0, l = nodes.length; i < l; i++) {
            let modelNode = modelNodes[i],
                location = this.getValue(modelNode.location, instance),
                rotation = this.getValue(modelNode.rotation, instance),
                scale = this.getValue(modelNode.scale, instance);

            nodes[i].setTransformation(location, rotation, scale);
        }

        const sequence = instance.sequence;

        var hwbones = this.boneArray;
        var initialReferences = this.initialReference;
        var boneLookup = this.boneLookup;
        var finalMatrix;

        if (sequence === -1) {
            finalMatrix = this.rootNode.worldMatrix;
        } else {
            finalMatrix = mat4.heap;
        }

        for (var i = 0, l = boneLookup.length; i < l; i++) {
            if (sequence !== -1) {
                const bone = boneLookup[i];

                mat4.multiply(finalMatrix, nodes[bone].worldMatrix, initialReferences[bone]);
            }

            hwbones.set(finalMatrix, i * 16);
        }
    },

    getValue(animRef, instance) {
        const sequence = instance.sequence;

        if (sequence !== -1) {
            return this.stg[sequence].getValue(animRef, instance)
        }

        return animRef.initValue;
    }
};

mix(M3Skeleton.prototype, Skeleton.prototype);
