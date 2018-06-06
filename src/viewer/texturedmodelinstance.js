import ModelInstance from './modelinstance';

/**
 * A textured model instance.
 * Gives a consistent API for texture overloading for handlers that use it.
 */
export default class TexturedModelInstance extends ModelInstance {
  /**
   * Overrides a texture with another one.
   *
   * @param {Texture} which
   * @param {Texture} texture
   */
  setTexture(which, texture) {
    let view = this.modelView.getShallowCopy();

    view.textures.set(which, texture);

    this.model.viewChanged(this, view);
  }
}
