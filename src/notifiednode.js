import { mix } from "./common";
import ViewerNode from "./node";

/**
 * @constructor
 * @augments ViewerNode
 */
function NotifiedNode() {
    ViewerNode.call(this, new ArrayBuffer(ViewerNode.BYTES_PER_ELEMENT), 0);
}

NotifiedNode.prototype = {
    /**
     * This override allows to selectively only allow some nodes to get automatically recalculated by their parents.
     * Recalculating automatically all nodes is a big no-no, since for skeletal hierarchies that get updated itratively, this will cause huge useless recursions.
     */
    notify() {
        this.recalculateTransformation();
    }
};

mix(NotifiedNode.prototype, ViewerNode.prototype);

export default NotifiedNode;
