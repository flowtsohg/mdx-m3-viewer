export default class Batch {
    /**
     * @param {number} index
     * @param {MdxLayer} layer
     * @param {MdxGeoset} geoset
     */
    constructor(index, layer, geoset) {
        this.index = index;
        this.layer = layer;
        this.geoset = geoset;
    }
};
