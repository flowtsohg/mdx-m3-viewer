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

export default MdxBatch;
