import {quat} from 'gl-matrix';
import {SkeletalNode} from '../../node';

/**
 * An M3 node.
 */
export default class M3Node extends SkeletalNode {
  /**
   * @param {quat} rotation
   */
  convertBasis(rotation) {
    let halfPI = Math.PI / 2;

    quat.rotateZ(rotation, rotation, halfPI);
    quat.rotateY(rotation, rotation, -halfPI);
  }
}
