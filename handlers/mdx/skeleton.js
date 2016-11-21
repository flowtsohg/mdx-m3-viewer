function MdxSkeleton(instance) {
    let model = instance.model,
        nodes = model.nodes,
        bones = model.bones,
        hierarchy = model.hierarchy;

    Skeleton.call(this, instance, nodes.length);

    this.sortedNodes = [];

    for (let i = 0, l = nodes.length; i < l; i++) {
        // Set the node pivots
        this.nodes[i].setPivot(nodes[i].pivot);

        // Set the node parent references
        this.nodes[i].setParent(this.getNode(nodes[i].parentId));

        // The sorted version of the nodes, for straight iteration in update()
        this.sortedNodes[i] = this.nodes[hierarchy[i]];
    }

    // The sorted version of the bone references in the model, for straight iteration in updateHW()
    this.bones = [];
    for (let i = 0, l = bones.length; i < l; i++) {
        this.bones[i] = this.nodes[bones[i].node.index];
    }

    this.modelNodes = model.sortedNodes;

    this.instance = instance;

    this.boneArray = null;
}

MdxSkeleton.prototype = {
    update() {
        if (this.boneArray) {
            const nodes = this.sortedNodes,
                modelNodes = this.modelNodes,
                instance = this.instance;

            for (let i = 0, l = nodes.length; i < l; i++) {
                let node = nodes[i],
                    modelNode = modelNodes[i],
                    translation = modelNode.getTranslation(instance),
                    rotation = modelNode.getRotation(instance),
                    scale = modelNode.getScale(instance);

                if (modelNode.billboarded) {
                    const camera = instance.env.camera;

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

            const bones = this.bones,
                boneArray = this.boneArray;


            for (let i = 0, l = bones.length; i < l; i++) {
                boneArray.set(bones[i].worldMatrix, i * 16 + 16);
            }
        }
    }
};

mix(MdxSkeleton.prototype, Skeleton.prototype);
