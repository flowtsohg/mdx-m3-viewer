import Scene from './scene';
import ResourceMapper from './resourcemapper';
import Model from './model';
import ModelInstance from './modelinstance';

/**
 * A render batch.
 */
export default abstract class RenderBatch {
  scene: Scene;
  model: Model;
  resourceMapper: ResourceMapper;
  instances: ModelInstance[] = [];
  count: number = 0;

  abstract render(): void;

  constructor(scene: Scene, model: Model, resourceMapper: ResourceMapper) {
    this.scene = scene;
    this.model = model;
    this.resourceMapper = resourceMapper;
  }

  clear() {
    this.count = 0;
  }

  add(instance: ModelInstance) {
    this.instances[this.count++] = instance;
  }
}
