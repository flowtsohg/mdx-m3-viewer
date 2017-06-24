/**
 * @constructor
 * @param {number} index
 * @param {MdxLayer} layer
 * @param {MdxGeoset} geoset
 */
function MdxBatch(index, layer, geoset) {
    this.index = index;
    this.layer = layer;
    this.geoset = geoset;
}

MdxBatch.prototype = {
    shouldRender(instance) {
        if (this.layer.getAlpha(instance) < 0.75 && this.geoset.getAlpha(instance) < 0.75) {
            return 0;
        }

        return 1;
    }
};
