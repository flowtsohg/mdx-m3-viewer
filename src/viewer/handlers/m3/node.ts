import { quat } from 'gl-matrix';
import { SkeletalNode } from '../../skeletalnode';

/**
 * An M3 node.
 */
export default class M3Node extends SkeletalNode {
  override convertBasis(rotation: quat): void {
    const halfPI = Math.PI / 2;

    quat.rotateZ(rotation, rotation, halfPI);
    quat.rotateY(rotation, rotation, -halfPI);
  }
}
