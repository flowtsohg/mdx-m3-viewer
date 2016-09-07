function Skeleton(parentNode, nodeCount) {
    const buffer = new ArrayBuffer(58 * 4 * nodeCount),
        nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes[i] = new Node(false, buffer, i * 58 * 4);
    }

    this.parentNode = parentNode;
    this.buffer = buffer;
    this.nodes = nodes;

    //for (let i = 0; i < nodeCount; i++) {
    //    nodes[i].setParent(skeleton.getNode(hierarchy[i]));
    //}
}

Skeleton.prototype = {
    getNode(id) {
        if (id === -1) {
            return this.parentNode;
        }

        return this.nodes[id];
    }
};
