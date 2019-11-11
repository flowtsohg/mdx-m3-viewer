/**
 * A texture mapper.
 */
export default class TextureMapper {
  /**
   * @param {Model} model
   * @param {?Map<number, Texture>} textures
   */
  constructor(model, textures) {
    /** @member {Model} */
    this.model = model;
    /** @member {Map<number, Texture} */
    this.textures = new Map(textures);
  }

  /**
   * @param {number} index
   * @return {?Texture}
   */
  get(index) {
    return this.textures.get(index);
  }
}
