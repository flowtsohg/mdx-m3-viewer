import Model from './model';

/**
 * A textured model.
 * Gives a consistent API for texture overloading for handlers that use it.
 */
export default class TexturedModel extends Model {
  /**
   * Bind a texture to some texture unit.
   * Checks the model view for an override.
   *
   * @param {Texture} texture
   * @param {number} unit
   * @param {ModelView} modelView
   */
  bindTexture(texture, unit, modelView) {
    let viewer = this.viewer;
    let textures = modelView.textures;

    if (textures.has(texture)) {
      texture = textures.get(texture);
    }

    // If the texture exists, bind it.
    // Otherwise, bind null, which will result in a black texture being bound to avoid console errors.
    if (texture) {
      texture.bind(unit);
    } else {
      viewer.webgl.bindTexture(null, unit);
    }
  }
}
