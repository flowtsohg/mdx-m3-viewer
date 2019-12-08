import Scene from './scene';
import TextureMapper from './texturemapper';
import Model from './model';
import ModelInstance from './modelinstance';


/**
 * A render batch.
 */
export default class RenderBatch {
  scene: Scene;
  model: Model;
  textureMapper: TextureMapper;
  instances: ModelInstance[];
  count: number;

  constructor(scene: Scene, model: Model, textureMapper: TextureMapper) {
    this.scene = scene;
    this.model = model;
    this.textureMapper = textureMapper;
    this.instances = [];
    this.count = 0;
  }

  clear() {
    this.count = 0;
  }

  add(instance: ModelInstance) {
    this.instances[this.count++] = instance;
  }

  render() {

  }
}
