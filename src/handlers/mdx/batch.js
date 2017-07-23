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
        return this.geoset.getAlpha(instance) >= 0.75;
    }
};

export default MdxBatch;
