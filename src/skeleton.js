/**
 * @class
 * @classdesc A base class for skeletons.
 * @param {?Node} parentNode The parent of this skeleton.
 * @param {number} nodeCount The number of nodes in this skeleton.
 */
function Skeleton(parentNode, nodeCount) {
    const buffer = new ArrayBuffer(58 * 4 * nodeCount),
        nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes[i] = new Node(false, buffer, i * 58 * 4);
    }

    /** @member {Node} */
    this.parentNode = parentNode;
    /** @member {ArrayBuffer} */
    this.buffer = buffer;
    /** @member {Node[]} */
    this.nodes = nodes;

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
            return this.parentNode;
        }

        return this.nodes[id];
    }
};