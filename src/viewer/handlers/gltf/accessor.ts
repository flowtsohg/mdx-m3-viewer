import GltfBufferView from './bufferview';
import GltfModel from './model';

const typeToComponents = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
};

/**
 * A glTF accessor.
 */
export default class GltfAccessor {
  model: GltfModel;
  bufferView: GltfBufferView;
  componentType: number;
  normalized: boolean = false;
  components: number;
  count: number;
  byteStride: number = 0;
  byteOffset: number = 0;

  constructor(model: GltfModel, accessor: object) {
    this.model = model;
    this.bufferView = model.bufferViews[accessor.bufferView];
    this.componentType = accessor.componentType;
    this.components = typeToComponents[accessor.type];
    this.count = accessor.count;

    if (accessor.byteStride !== undefined) {
      this.byteStride = accessor.byteStride;
    }

    if (accessor.byteOffset !== undefined) {
      this.byteOffset = accessor.byteOffset;
    }
  }

  bind(location: number) {
    let gl = this.model.viewer.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferView.buffer);
    gl.vertexAttribPointer(location, this.components, this.componentType, this.normalized, this.byteStride, this.byteOffset);
  }

  render(mode: number) {
    let gl = this.model.viewer.gl;

    if (this.bufferView.target === gl.ARRAY_BUFFER) {
      gl.drawArrays(mode, 0, this.count);
    } else {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferView.buffer)
      gl.drawElements(mode, this.count, this.componentType, this.byteOffset);
    }
  }
}
