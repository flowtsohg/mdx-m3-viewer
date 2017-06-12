/**
 * @constructor
 * @param {number} nodeCount
 * @param {?ViewerNode} parent
 */
function Skeleton(nodeCount, parent) {
    let buffer = new ArrayBuffer(nodeCount * ViewerNode.BYTES_PER_ELEMENT),
        nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes[i] = new ViewerNode(buffer, i * ViewerNode.BYTES_PER_ELEMENT);
    }

    /** @member {ViewerNode} */
    this.rootNode = new NotifiedNode();
    /** @member {ArrayBuffer} */
    this.buffer = buffer;
    /** @member {Array<ViewerNode>} */
    this.nodes = nodes;

    this.rootNode.setParent(parent);

    //for (let i = 0; i < nodeCount; i++) {
    //    nodes[i].setParent(skeleton.getNode(hierarchy[i]));
    //}
}

Skeleton.prototype = {
    /**
     * @method
     * @desc Get the i'th node. If the given id is -1, return the parent instead.
     * @param {number} id The index of the node.
     * @returns {ViewerNode}
     */
    getNode(id) {
        if (id === -1) {
            return this.rootNode;
        }

        return this.nodes[id];
    }
};
