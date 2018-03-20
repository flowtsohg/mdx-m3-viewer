import { SceneNode } from './node';

export default class Skeleton {
    /**
     * @param {number} nodeCount
     * @param {?SceneNode} parent
     */
    constructor(nodeCount, parent) {
        let nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            let node = new SceneNode();

            // Signal that this is a node in a skeleton.
            // See Node.
            node.isSkeletal = true;

            nodes[i] = node;
        }

        /** @member {SceneNode} */
        this.parent = parent
        /** @member {Array<SceneNode>} */
        this.nodes = nodes;

        //for (let i = 0; i < nodeCount; i++) {
        //    nodes[i].setParent(skeleton.getNode(hierarchy[i]));
        //}
    }

    /**
     * Get the id'th node. If the given id is -1, return the parent instead.
     * 
     * @param {number} id The index of the node.
     * @returns {SceneNode}
     */
    getNode(id) {
        if (id === -1) {
            return this.parent;
        }

        return this.nodes[id];
    }
};
