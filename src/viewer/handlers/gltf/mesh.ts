import GltfModel from './model';
import GltfPrimitive from './primitive';

/**
 * A glTF mesh.
 */
export default class GltfMesh {
  primitives: GltfPrimitive[] = [];

  constructor(model: GltfModel, mesh: object) {
    for (let primitive of mesh.primitives) {
      this.primitives.push(new GltfPrimitive(model, primitive));
    }
  }
}
