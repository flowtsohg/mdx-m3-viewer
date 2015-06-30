Mdx.Skeleton = function (model, ctx) {
    var i, l;
    var pivots = model.pivots;
    var nodes = model.nodes;
    var bones = model.bones;
    var hierarchy = model.hierarchy;

    this.hierarchy = hierarchy;

    // If there are no original bones, reference the root node injected by the parser, since the shader requires at least one bone
    this.bones = bones || [{node: 0}];

    BaseSkeleton.call(this, this.bones.length + 1, ctx);

    for (i = 0, l = nodes.length; i < l; i++) {
        this.nodes[i] = new Mdx.ShallowNode(nodes[i]);
    }

    // To avoid heap allocations
    this.locationVec = vec3.create();
    this.scaleVec = vec3.create();
    this.rotationQuat = quat.create();
    this.rotationQuat2 = quat.create();
};

Mdx.Skeleton.prototype = extend(BaseSkeleton.prototype, {
    update: function (sequence, frame, counter, instance, context) {
        var nodes = this.nodes;
        var hierarchy = this.hierarchy;
        var root = this.rootNode;

        root.setFromParent(instance);

        for (var i = 0, l = hierarchy.length; i < l; i++) {
            this.updateNode(nodes[hierarchy[i]], sequence, frame, counter, context);
        }

        this.updateHW(context.gl.ctx);
    },

    updateNode: function (node, sequence, frame, counter, context) {
        var parent = this.getNode(node.parentId);
        var nodeImpl = node.nodeImpl;
        var translation = nodeImpl.getTranslation(sequence, frame, counter);
        var rotation = nodeImpl.getRotation(sequence, frame, counter);
        var scale = nodeImpl.getScale(sequence, frame, counter);
        var finalRotation = this.rotationQuat2;
        
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
        var bones = this.bones,
            hwbones = this.hwbones,
            nodes = this.nodes;

        for (var i = 0, l = bones.length; i < l; i++) {
            hwbones.set(nodes[bones[i].node].worldMatrix, i * 16 + 16);
        }

        this.updateBoneTexture(ctx);
    }
});