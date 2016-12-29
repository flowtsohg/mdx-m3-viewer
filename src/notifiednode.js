/**
 * @class
 * @classdesc A scene node, that can be moved around and parented to other nodes.
 * @extends Node
 * @param {?ArrayBuffer} buffer An ArrayBuffer object to add this node to. A new buffer will be created if one isn't given.
 * @param {?number} offset An offset into the buffer, if one was given.
 */
function NotifiedNode(buffer, offset) {
    Node.call(this, buffer, offset);
}

NotifiedNode.prototype = {
    /**
     * @method
     * @desc Called by this node's parent, when the parent is recalculated.
     *       This override allows to selectively only allow some nodes to get automatically recalculated by their parents.
     *       Recalculating automatically all nodes is a big no-no, since for skeletal hierarchies that get updated itratively, this will cause huge useless recursions.
     */
    notify() {
        this.recalculateTransformation();
    }
};

mix(NotifiedNode.prototype, Node.prototype);
