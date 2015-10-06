Mdx.Skeleton = function (asyncInstance, model, ctx) {
    var nodes = model.nodes,
        bones = model.bones;

    this.hierarchy = model.hierarchy;

    BaseSkeleton.call(this, bones.length + 1, ctx);

    // Shallow nodes referencing the actual nodes in the model
    for (var i = 0, l = nodes.length; i < l; i++) {
        this.nodes[i] = new Mdx.ShallowNode(nodes[i]);
    }

    // Set the node parent references
    for (var i = 0, l = nodes.length; i < l; i++) {
        this.nodes[i].setParent(this.getNode(this.nodes[i].parentId));
    }

    // The sorted version of the nodes, for straight iteration in update()
    this.sortedNodes = [];
    for (i = 0, l = nodes.length; i < l; i++) {
        this.sortedNodes[i] = this.nodes[this.hierarchy[i]];
    }

    // The sorted version of the bone references in the model, for straight iteration in updateHW()
    this.sortedBones = [];
    for (i = 0, l = bones.length; i < l; i++) {
        this.sortedBones[i] = this.nodes[bones[i].node.index];
    }

    // To avoid heap allocations
    this.rotationQuat = quat.create();
    this.rotationQuat2 = quat.create();

    this.rootNode.setParent(asyncInstance);
};

Mdx.Skeleton.prototype = extend(BaseSkeleton.prototype, {
    update: function (sequence, frame, counter, instance, context) {
        var nodes = this.sortedNodes;
        var hierarchy = this.hierarchy;

        this.rootNode.recalculateTransformation();

        for (var i = 0, l = hierarchy.length; i < l; i++) {
            this.updateNode(nodes[i], sequence, frame, counter, context);
        }

        this.updateHW(context.gl.ctx);
    },

    updateNode: function (node, sequence, frame, counter, context) {
        var parent = this.getNode(node.parentId);
        var nodeImpl = node.nodeImpl;
        var translation = nodeImpl.getTranslation(sequence, frame, counter);
        var rotation = nodeImpl.getRotation(sequence, frame, counter);
        var scale = nodeImpl.getScale(sequence, frame, counter);
        var finalRotation = this.rotationQuat;
        
        if (nodeImpl.billboarded) {
            quat.set(finalRotation, 0, 0, 0, 1);
            quat.mul(finalRotation, finalRotation, quat.conjugate(this.rotationQuat2, parent.worldRotation));
            quat.rotateZ(finalRotation, finalRotation, -context.camera.phi - Math.PI / 2);
            quat.rotateY(finalRotation, finalRotation, -context.camera.theta - Math.PI / 2);
        } else {
            quat.copy(finalRotation, rotation);
        }
        
        node.setLocal(translation, finalRotation, scale);
    },

    updateHW: function (ctx) {
        var sortedBones = this.sortedBones,
            hwbones = this.hwbones;

        for (var i = 0, l = sortedBones.length; i < l; i++) {
            hwbones.set(sortedBones[i].worldMatrix, i * 16 + 16);
        }

        this.updateBoneTexture(ctx);
    }
});
