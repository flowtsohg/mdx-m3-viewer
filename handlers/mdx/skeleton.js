/**
 * @constructor
 * @augments Skeleton
 * @param {MdxModelInstance} instance
 */
function MdxSkeleton(instance) {
    let model = instance.model,
        modelNodes = model.nodes,
        modelBones = model.bones,
        hierarchy = model.hierarchy,
        nodes,
        sortedNodes = [],
        bones = [];

    Skeleton.call(this, modelNodes.length, instance);

    // Not defined before the Skeleton constructor
    nodes = this.nodes;

    for (let i = 0, l = modelNodes.length; i < l; i++) {
        let node = nodes[i],
            modelNode = modelNodes[i];

        // Set the node pivots
        node.setPivot(modelNode.pivot);

        // Set the node parent references
        node.setParent(this.getNode(modelNode.parentId));

        // Node flags
        //node.dontInheritTranslation = modelNode.dontInheritTranslation;
        //node.dontInheritRotation = modelNode.dontInheritRotation;
        //node.dontInheritScaling = modelNode.dontInheritScaling;

        // The sorted version of the nodes, for straight iteration in update()
        sortedNodes[i] = nodes[hierarchy[i]];
    }

    // The sorted version of the bone references in the model, for straight iteration in updateHW()
    for (let i = 0, l = modelBones.length; i < l; i++) {
        bones[i] = nodes[modelBones[i].node.index];
    }

    this.modelNodes = model.sortedNodes;
    this.sortedNodes = sortedNodes;
    this.bones = bones;
    this.instance = instance;
}

MdxSkeleton.prototype = {
    update() {
        let instance = this.instance;

        // If this skeleton has no bone array, it means the owning instance is not visible.
        // Therefore, there is no point to update the nodes.
        if (instance.bucket) {
            let nodes = this.sortedNodes,
                modelNodes = this.modelNodes,
                bones = this.bones,
                boneArray = this.instance.boneArray;

            // Update the nodes
            for (let i = 0, l = nodes.length; i < l; i++) {
                let node = nodes[i],
                    modelNode = modelNodes[i],
                    translation = modelNode.getTranslation(instance),
                    rotation = modelNode.getRotation(instance),
                    scale = modelNode.getScale(instance);

                if (modelNode.billboarded) {
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

                node.setTransformation(translation, rotation, scale);
            }

            // Update the bone texture.
            for (let i = 0, l = bones.length; i < l; i++) {
                boneArray.set(bones[i].worldMatrix, i * 16 + 16);
            }

            this.instance.bucket.updateBoneTexture[0] = 1;
        }
    }
};

mix(MdxSkeleton.prototype, Skeleton.prototype);
