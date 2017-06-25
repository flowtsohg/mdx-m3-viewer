/**
 * @constructor
 * @extends {Skeleton}
 * @param {M3ModelInstance} instance
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
        let instance = this.instance;

        if (instance.bucket) {
            // Update the nodes.
            let nodes = this.nodes,
                modelNodes = this.modelNodes;

            for (let i = 0, l = nodes.length; i < l; i++) {
                let modelNode = modelNodes[i],
                    location = this.getValue(modelNode.location, instance),
                    rotation = this.getValue(modelNode.rotation, instance),
                    scale = this.getValue(modelNode.scale, instance);

                if (modelNode.billboard1) {
                    rotation = quat.heap;
                    
                    // Cancel the parent's rotation.
                    quat.copy(rotation, node.parent.inverseWorldRotation);

                    // Rotate inversly to the camera, so as to always face it.
                    quat.mul(rotation, rotation, instance.scene.camera.inverseWorldRotation);

                    // The coordinate systems are different between the handler and the viewer.
                    // Therefore, get to the viewer's coordinate system.
                    quat.rotateZ(rotation, rotation, Math.PI / 2);
                    quat.rotateY(rotation, rotation, -Math.PI / 2);
                }

                nodes[i].setTransformation(location, rotation, scale);
            }

            // Update the bone texture data.
            let sequence = instance.sequence,
                hwbones = instance.boneArray,
                initialReferences = this.initialReference,
                boneLookup = this.boneLookup,
                finalMatrix;

            if (sequence === -1) {
                finalMatrix = instance.worldMatrix;
            } else {
                finalMatrix = mat4.heap;
            }

            for (let i = 0, l = boneLookup.length; i < l; i++) {
                if (sequence !== -1) {
                    let bone = boneLookup[i];

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
