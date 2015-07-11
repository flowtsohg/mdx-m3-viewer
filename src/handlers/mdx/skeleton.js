Mdx.Skeleton = function (model, ctx) {
    var nodes = model.nodes,
        bones = model.bones;

    // This list is used to access all the nodes in a loop while keeping the hierarchy in mind.
    this.hierarchy = this.setupHierarchy([], nodes, -1);

    BaseSkeleton.call(this, bones.length + 1, ctx);

    // Shallow nodes referencing the actual nodes in the model
    for (var i = 0, l = nodes.length; i < l; i++) {
        this.nodes[i] = new Mdx.ShallowNode(nodes[i]);
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
};

Mdx.Skeleton.prototype = extend(BaseSkeleton.prototype, {
    setupHierarchy: function (hierarchy, nodes, parent) {
        var node;

        for (var i = 0, l = nodes.length; i < l; i++) {
            node = nodes[i];

            if (node.parentId === parent) {
                hierarchy.push(i);

                this.setupHierarchy(hierarchy, nodes, node.objectId);
            }
        }

        return hierarchy;
    },

    update: function (sequence, frame, counter, instance, context) {
        var nodes = this.sortedNodes;
        var hierarchy = this.hierarchy;

        this.rootNode.setFromParent(instance);

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
            quat.mul(finalRotation, finalRotation, quat.conjugate([], parent.worldRotation));
            quat.rotateZ(finalRotation, finalRotation, -context.camera.phi - Math.PI / 2);
            quat.rotateY(finalRotation, finalRotation, -context.camera.theta - Math.PI / 2);
        } else {
            quat.copy(finalRotation, rotation);
        }
        
        node.update(parent, finalRotation, translation, scale);
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
