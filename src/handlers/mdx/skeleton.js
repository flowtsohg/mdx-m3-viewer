var defaultTransformations = {
    translation: [0, 0, 0],
    rotation: [0, 0, 0, 1],
    scaling: [1, 1, 1]
};

function Skeleton(model, ctx) {
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
        this.nodes[i] = new ShallowNode(nodes[i]);
    }

    // To avoid heap allocations
    this.localMatrix = mat4.create();
    this.locationVec = vec3.create();
    this.scaleVec = vec3.create();
    this.rotationQuat = quat.create();
}

Skeleton.prototype = extend(BaseSkeleton.prototype, {
    update: function (sequence, frame, counter, worldMatrix, context) {
        var nodes = this.nodes;
        var hierarchy = this.hierarchy;
        var root = this.rootNode;

        root.update(worldMatrix);

        for (var i = 0, l = hierarchy.length; i < l; i++) {
            this.updateNode(nodes[hierarchy[i]], sequence, frame, counter, context);
        }

        this.updateHW(context.gl.ctx);
    },

    updateNode: function (node, sequence, frame, counter, context) {
        var nodeImpl = node.nodeImpl;
        var pivot = node.pivot;
        var negativePivot = node.negativePivot;
        var localMatrix = this.localMatrix;
        var translation = getSDValue(sequence, frame, counter, nodeImpl.sd.translation, defaultTransformations.translation, this.locationVec);
        var rotation = getSDValue(sequence, frame, counter, nodeImpl.sd.rotation, defaultTransformations.rotation, this.rotationQuat);
        var scale = getSDValue(sequence, frame, counter, nodeImpl.sd.scaling, defaultTransformations.scaling, this.scaleVec);

        mat4.fromRotationTranslationScaleOrigin(localMatrix, rotation, translation, scale, pivot);

        var parent = this.getNode(node.parentId);

        mat4.multiply(node.worldMatrix, parent.worldMatrix, localMatrix);

        if (nodeImpl.billboarded) {
            // TODO optimize these matrix operations

            mat4.identity(localMatrix);

            mat4.translate(localMatrix, localMatrix, pivot);

            // -270 degrees
            mat4.rotate(localMatrix, localMatrix, -context.camera.phi - 4.71238, vec3.UNIT_Z);
            // -90 degrees
            mat4.rotate(localMatrix, localMatrix, context.camera.theta - 1.57079, vec3.UNIT_Y);

            mat4.translate(localMatrix, localMatrix, negativePivot);

            mat4.multiply(node.worldMatrix, node.worldMatrix, localMatrix);
        }

        node.updateScale();
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