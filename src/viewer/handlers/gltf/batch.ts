import GltfPrimitive from './primitive';
import GltfMaterial from './material';

/**
 * A glTF batch.
 */
export default class GltfBatch {
  node: number;
  primitive: GltfPrimitive;
  material: GltfMaterial;

  constructor(node: number, primitive: GltfPrimitive, material: GltfMaterial) {
    this.node = node;
    this.primitive = primitive;
    this.material = material;
  }
}
