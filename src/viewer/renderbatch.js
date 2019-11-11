/**
 * A render batch.
 */
export default class RenderBatch {
  /**
   * @param {Scene} scene
   * @param {Model} model
   * @param {TextureMapper} textureMapper
   */
  constructor(scene, model, textureMapper) {
    /** @member {Scene} */
    this.scene = scene;
    /** @member {Model} */
    this.model = model;
    /** @member {TextureMapper} */
    this.textureMapper = textureMapper;
    /** @member {Array<ModelInstance>} */
    this.instances = [];
    /** @member {number} */
    this.count = 0;
  }

  /**
   *
   */
  clear() {
    this.count = 0;
  }

  /**
   * @param {ModelInstance} instance
   */
  add(instance) {
    this.instances[this.count++] = instance;
  }

  /**
   *
   */
  render() {

  }
}
