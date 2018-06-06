import ModelView from './modelview';

/**
 * A textured model view.
 * Gives a consistent API for texture overloading for handlers that use it.
 */
export default class TexturedModelView extends ModelView {
  /**
   * @param {Model} model
   */
  constructor(model) {
    super(model);

    /** @member {Map<Texture, Texture>} */
    this.textures = new Map();
  }

  /**
   * The shallow copy of a textured model view is a map of its textures.
   *
   * @return {Object}
   */
  getShallowCopy() {
    return {textures: new Map(this.textures)};
  }

  /**
   * Apply the texture map from the given shallow view.
   *
   * @param {Object} view
   */
  applyShallowCopy(view) {
    let textures = this.textures;

    for (let [src, dst] of view.textures) {
      textures.set(src, dst);
    }
  }

  /**
   * Two textured model views are equal if their texture maps have the same mapping.
   *
   * @param {Object} view
   * @return {boolean}
   */
  equals(view) {
    let textures = this.textures;
    let dstTextures = view.textures;

    if (textures.length !== dstTextures.length) {
      return false;
    }

    for (let [src, dst] of dstTextures) {
      if (textures.get(src) !== dst) {
        return false;
      }
    }

    return true;
  }
}
