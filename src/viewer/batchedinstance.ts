import ModelInstance from './modelinstance';
import RenderBatch from './renderbatch';
import TextureMapper from './texturemapper';

/**
 * A batched model instance.
 */
export default abstract class BatchedInstance extends ModelInstance {
  /**
   * Get a concrete RenderBatch object.
   */
  abstract getBatch(textureMapper: TextureMapper): RenderBatch;

  isBatched() {
    return true;
  }
}
