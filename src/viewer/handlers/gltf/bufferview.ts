/**
 * A glTF buffer view.
 */
export default class GltfBufferView {
  buffer: WebGLBuffer | Uint8Array;
  target: number = -1;

  constructor(gl: WebGLRenderingContext, bufferView: object, buffer: Uint8Array) {
    let target = bufferView.target;
    let begin = bufferView.byteOffset;
    let end = begin + bufferView.byteLength;
    let view = buffer.subarray(begin, end);

    if (target !== undefined) {
      this.buffer = <WebGLBuffer>gl.createBuffer();

      gl.bindBuffer(target, this.buffer);
      gl.bufferData(target, view, gl.STATIC_DRAW);

      this.target = target;
    } else {
      this.buffer = view;
    }
  }
}
