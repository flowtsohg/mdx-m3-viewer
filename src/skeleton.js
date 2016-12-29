/**
 * @class
 * @classdesc A base class for skeletons.
 * @param {?Node} parent The parent of this skeleton.
 * @param {number} nodeCount The number of nodes in this skeleton.
 */
function Skeleton(parent, nodeCount) {
    let buffer = new ArrayBuffer(nodeCount * Node.BYTES_PER_ELEMENT),
        nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes[i] = new Node(buffer, i * Node.BYTES_PER_ELEMENT);
    }

    /** @member {Node} */
    this.rootNode = new NotifiedNode();
    /** @member {ArrayBuffer} */
    this.buffer = buffer;
    /** @member {Node[]} */
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
     * @returns {Node}
     */
    getNode(id) {
        if (id === -1) {
            return this.rootNode;
        }

        return this.nodes[id];
    }
};
