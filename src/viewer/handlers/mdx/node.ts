import { quat } from 'gl-matrix';
import { SkeletalNode } from '../../skeletalnode';

/**
 * An MDX node.
 */
export default class MdxNode extends SkeletalNode {
  override convertBasis(rotation: quat): void {
    quat.rotateY(rotation, rotation, -Math.PI / 2);
    quat.rotateX(rotation, rotation, -Math.PI / 2);
  }
}
