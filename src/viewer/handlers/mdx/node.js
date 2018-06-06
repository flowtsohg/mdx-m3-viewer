import {SkeletalNode} from '../../node';

/**
 * An MDX node.
 */
export default class MdxNode extends SkeletalNode {
  /**
   * @param {quat} rotation
   */
  convertBasis(rotation) {
    let halfPI = Math.PI / 2;

    quat.rotateZ(rotation, rotation, halfPI);
    quat.rotateY(rotation, rotation, -halfPI);
  }
}
