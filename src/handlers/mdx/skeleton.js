var defaultTransformations = [
    [0, 0, 0, 1],
    [0, 0, 0],
    [1, 1, 1]
];

Mdx.Skeleton = function (model) {
    var nodes = model.nodes,
        bones = model.bones,
        pivots = model.pivots,
        hierarchy = model.hierarchy,
        node;

    // Root node
    this.rootNode = new BaseNode();

    // Shared nodes
    var nodeBuffer = new Float32Array(nodes.length * 55);
    var sharedNodes = [];
    for (var i = 0, l = nodes.length; i < l; i++) {
        node = new SharedNode(i, nodeBuffer);

        vec3.copy(node.pivot, pivots[i].data);
        node.nodeImpl = nodes[i];

        sharedNodes[i] = node;
    }
    this.sharedNodes = sharedNodes;

    // Nodes
    var sortedNodes = [];
    for (i = 0, l = nodes.length; i < l; i++) {
        sortedNodes[i] = sharedNodes[hierarchy[i]];
    }
    this.sortedNodes = sortedNodes;

    // Bones
    var sortedBones = [];
    for (i = 0, l = bones.length; i < l; i++) {
        sortedBones[i] = sharedNodes[bones[i].node.index];
    }
    this.bones = sortedBones;
    this.boneBuffer = new Float32Array((bones.length + 1) * 16);
};

Mdx.Skeleton.prototype = {
    getNode: function (whichNode) {
        if (whichNode === -1) {
            return this.rootNode;
        }

        return this.sharedNodes[whichNode];
    },

    update: function (boneBuffer, sequence, frame, counter) {
        var sortedNodes = this.sortedNodes;

        //this.rootNode.setFromParent(instance);

        for (var i = 0, l = sortedNodes.length; i < l; i++) {
            this.updateNode(sortedNodes[i], sequence, frame, counter);
        }

        this.updateBoneBuffer(boneBuffer);
    },

    updateNode: function (node, sequence, frame, counter) {
        var nodeImpl = node.nodeImpl;
        var parent = this.getNode(nodeImpl.parentId);
        var translation = nodeImpl.getTranslation(sequence, frame, counter);
        var rotation = nodeImpl.getRotation(sequence, frame, counter);
        var scale = nodeImpl.getScale(sequence, frame, counter);
        //var finalRotation = this.rotationQuat;
        
        //if (nodeImpl.billboarded) {
        //    quat.set(finalRotation, 0, 0, 0, 1);
        //    quat.mul(finalRotation, finalRotation, quat.conjugate(this.rotationQuat2, parent.worldRotation));
        //    quat.rotateZ(finalRotation, finalRotation, -context.camera.phi - Math.PI / 2);
        //    quat.rotateY(finalRotation, finalRotation, -context.camera.theta - Math.PI / 2);
        //} else {
        //    quat.copy(finalRotation, rotation);
        //}
        
        node.update(parent, rotation, translation, scale);
    },

    updateBoneBuffer: function (boneBuffer) {
        var bones = this.bones,
            boneBuffer = this.boneBuffer;
        
        for (var i = 0, l = bones.length; i < l; i++) {
            boneBuffer.set(bones[i].worldMatrix, i * 16 + 16);
        }
    }
};
