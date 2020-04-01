import Scene from '../../scene';
import TextureMapper from '../../texturemapper';
import BatchedInstance from '../../batchedinstance';
import MdxRenderBatch from './renderbatch';

/**
 * A simple model instance.
 */
export default class MdxSimpleInstance extends BatchedInstance {
  getBatch(textureMapper: TextureMapper) {
    return new MdxRenderBatch(<Scene>this.scene, this.model, textureMapper);
  }
}
