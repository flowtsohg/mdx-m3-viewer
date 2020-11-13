import ModelInstance from './modelinstance';
import RenderBatch from './renderbatch';
import ResourceMapper from './resourcemapper';

/**
 * A batched model instance.
 */
export default abstract class BatchedInstance extends ModelInstance {
  /**
   * Get a concrete RenderBatch object.
   */
  abstract getBatch(resourceMapper: ResourceMapper): RenderBatch;

  isBatched() {
    return true;
  }
}
