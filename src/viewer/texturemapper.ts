import Model from './model';
import Texture from './texture';

/**
 * A texture mapper.
 */
export default class TextureMapper {
  model: Model;
  textures: Map<any, Texture>;

  constructor(model: Model, textures?: Map<any, Texture>) {
    let map;

    if (textures) {
      map = new Map(textures);
    } else {
      map = new Map();
    }

    this.model = model;
    this.textures = map;
  }

  get(key: any) {
    return this.textures.get(key);
  }
}
