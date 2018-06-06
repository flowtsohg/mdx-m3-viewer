/**
 * An MDX batch.
 */
export default class Batch {
  /**
   * @param {number} index
   * @param {Layer} layer
   * @param {Geoset} geoset
   */
  constructor(index, layer, geoset) {
    /** @member {number} */
    this.index = index;
    /** @member {Layer} */
    this.layer = layer;
    /** @member {Geoset} */
    this.geoset = geoset;
  }
}
