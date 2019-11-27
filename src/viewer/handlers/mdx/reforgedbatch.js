/**
 * An MDX Reforged batch.
 */
export default class ReforgedBatch {
  /**
   * @param {number} index
   * @param {Geoset} geoset
   * @param {Material} material
   */
  constructor(index, geoset, material) {
    /** @member {number} */
    this.index = index;
    /** @member {Geoset} */
    this.geoset = geoset;
    /** @member {Material} */
    this.material = material;
  }
}
