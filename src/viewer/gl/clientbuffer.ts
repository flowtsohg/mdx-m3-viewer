/**
 * A buffer.
 */
export default class ClientBuffer {
  gl: WebGLRenderingContext;
  buffer: WebGLBuffer;
  size: number;
  arrayBuffer: ArrayBuffer | null;
  byteView: Uint8Array | null;
  floatView: Float32Array | null;

  constructor(gl: WebGLRenderingContext, size: number = 64) {
    this.gl = gl;
    this.buffer = <WebGLBuffer>gl.createBuffer();
    this.size = 0;
    this.arrayBuffer = null;
    this.byteView = null;
    this.floatView = null;

    this.reserve(size);
  }

  reserve(size: number) {
    if (this.size < size) {
      let gl = this.gl;

      this.size = size;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, size, gl.DYNAMIC_DRAW);

      this.arrayBuffer = new ArrayBuffer(size);
      this.byteView = new Uint8Array(this.arrayBuffer);
      this.floatView = new Float32Array(this.arrayBuffer);
    }
  }

  bindAndUpdate(size: number = this.size) {
    let gl = this.gl;
    let byteView = <Uint8Array>this.byteView;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, byteView.subarray(0, size));
  }
}
