import {quat} from 'gl-matrix';
import {SkeletalNode} from '../../node';

/**
 * An MDX node.
 */
export default class MdxNode extends SkeletalNode {
  /**
   * @param {quat} rotation
   */
  convertBasis(rotation) {
    quat.rotateY(rotation, rotation, -Math.PI / 2);
  }
}
