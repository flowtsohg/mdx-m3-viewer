/**
 * An MDX batch.
 */
export default class Batch {
  /**
   * @param {number} index
   * @param {Geoset} geoset
   * @param {Layer} layer
   * @param {boolean} isExtended
   */
  constructor(index, geoset, layer, isExtended) {
    /** @member {number} */
    this.index = index;
    /** @member {Geoset} */
    this.geoset = geoset;
    /** @member {Layer} */
    this.layer = layer;
    /** @member {boolean} */
    this.isExtended = isExtended;
  }
}
