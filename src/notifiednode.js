/**
 * @constructor
 * @mixes ViewerNode
 * @param {?ArrayBuffer} buffer
 * @param {?number} offset
 */
function NotifiedNode(buffer, offset) {
    ViewerNode.call(this, buffer, offset);
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

mix(NotifiedNode.prototype, ViewerNode.prototype);
