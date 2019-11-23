/**
 * A texture mapper.
 */
export default class TextureMapper {
  /**
   * @param {Model} model
   * @param {?Map<*, Texture>} textures
   */
  constructor(model, textures) {
    /** @member {Model} */
    this.model = model;
    /** @member {Map<*, Texture} */
    this.textures = new Map(textures);
  }

  /**
   * @param {*} key
   * @return {?Texture}
   */
  get(key) {
    return this.textures.get(key);
  }
}
