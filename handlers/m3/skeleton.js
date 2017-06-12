/**
 * @constructor
 * @param {M3Instance} instance
 */
function M3Skeleton(instance) {
    let model = instance.model,
        bones = model.bones,
        boneLookup = model.boneLookup;

    Skeleton.call(this, bones.length, instance);

    this.instance = instance;
    this.modelNodes = bones;
    this.initialReference = model.initialReference;
    this.sts = model.sts;
    this.stc = model.stc;
    this.stg = model.stg;
    this.boneLookup = boneLookup;
    
    // Set the bone parent references
    for (let i = 0, l = bones.length; i < l; i++) {
        this.nodes[i].setParent(this.getNode(bones[i].parent));
    }
}

M3Skeleton.prototype = {
    update() {
        if (this.instance.bucket) {
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

            var hwbones = this.instance.boneArray;
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
        }
    },

    getValue(animRef, instance) {
        let sequence = instance.sequence;

        if (sequence !== -1) {
            return this.stg[sequence].getValue(animRef, instance)
        }

        return animRef.initValue;
    }
};

mix(M3Skeleton.prototype, Skeleton.prototype);
