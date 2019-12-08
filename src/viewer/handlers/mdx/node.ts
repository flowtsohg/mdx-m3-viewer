import { quat } from 'gl-matrix';
import { SkeletalNode } from '../../node';

/**
 * An MDX node.
 */
export default class MdxNode extends SkeletalNode {
  convertBasis(rotation: quat) {
    quat.rotateY(rotation, rotation, -Math.PI / 2);
    quat.rotateX(rotation, rotation, -Math.PI / 2);
  }
}
