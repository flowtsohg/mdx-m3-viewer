function MdxSkeleton(instance) {
    let model = instance.model,
        modelNodes = model.nodes,
        modelBones = model.bones,
        hierarchy = model.hierarchy,
        nodes,
        sortedNodes = [],
        bones = [];

    Skeleton.call(this, instance, modelNodes.length);

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
        node.dontInheritTranslation = modelNode.dontInheritTranslation;
        node.dontInheritRotation = modelNode.dontInheritRotation;
        node.dontInheritScaling = modelNode.dontInheritScaling;

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

    // Will be set by the instance when it is added to a bucket.
    this.boneArray = null;
}

MdxSkeleton.prototype = {
    update() {
        // If this skeleton has no bone array, it means the owning instance is not visible.
        // Therefore, there is no point to update the nodes.
        if (this.boneArray) {
            let nodes = this.sortedNodes,
                modelNodes = this.modelNodes,
                instance = this.instance,
                bones = this.bones,
                boneArray = this.boneArray;

            // Update the nodes
            for (let i = 0, l = nodes.length; i < l; i++) {
                let node = nodes[i],
                    modelNode = modelNodes[i],
                    translation = modelNode.getTranslation(instance),
                    rotation = modelNode.getRotation(instance),
                    scale = modelNode.getScale(instance);

                if (modelNode.billboarded) {
                    let camera = instance.bucket.modelView.scene.camera;

                    var blarg = [0, 0, 0, 1];

                    //quat.conjugate(blarg, node.worldRotation);
                    
                    
                    quat.rotateZ(blarg, blarg, -Math.PI / 2);
                    quat.rotateY(blarg, blarg, - Math.PI / 2);
                    quat.mul(blarg, camera.inverseRotation, blarg);

                    //quat.copy(blarg, camera.inverseRotation)
                    //quat.mul(blarg, blarg, node.parent.worldRotation);

                    //quat.copy(rotation, blarg);

                   // quat.copy(rotation, camera.inverseRotation)
                    //rotation = camera.inverseRotation;

                    rotation = blarg;
                }

                node.setTransformation(translation, rotation, scale);
            }

            // Update the bones.
            for (let i = 0, l = bones.length; i < l; i++) {
                boneArray.set(bones[i].worldMatrix, i * 16 + 16);
            }
        }
    }
};

mix(MdxSkeleton.prototype, Skeleton.prototype);
