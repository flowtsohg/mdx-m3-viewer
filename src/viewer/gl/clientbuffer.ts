/**
 * A buffer.
 */
export default class ClientBuffer {
  gl: WebGLRenderingContext;
  buffer: WebGLBuffer;
  size: number = 0;
  arrayBuffer: ArrayBuffer | null = null;
  byteView: Uint8Array | null = null;
  floatView: Float32Array | null = null;

  constructor(gl: WebGLRenderingContext, size: number = 4) {
    this.gl = gl;
    this.buffer = <WebGLBuffer>gl.createBuffer();

    this.reserve(size);
  }

  reserve(size: number) {
    if (this.size < size) {
      let gl = this.gl;

      // Ensure the size is on a 4 byte boundary.
      this.size = Math.ceil(size / 4) * 4;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.size, gl.DYNAMIC_DRAW);

      this.arrayBuffer = new ArrayBuffer(this.size);
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
