/**
 * A buffer.
 */
export default class ClientBuffer {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {?number} size
   */
  constructor(gl, size = 64) {
    /** @member {WebGLRenderingContext} */
    this.gl = gl;
    /** @member {WebGLBuffer} */
    this.buffer = gl.createBuffer();
    /** @member {number} */
    this.size = 0;
    /** @member {ArrayBuffer} */
    this.arrayBuffer = null;
    /** @member {?Uint8Array} */
    this.byteView = null;
    /** @member {?Float32Array} */
    this.floatView = null;

    this.reserve(size);
  }

  /**
  * @param {number} size
  */
  reserve(size) {
    if (this.size < size) {
      const gl = this.gl;

      this.size = size;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, size, gl.DYNAMIC_DRAW);

      this.arrayBuffer = new ArrayBuffer(size);
      this.byteView = new Uint8Array(this.arrayBuffer);
      this.floatView = new Float32Array(this.arrayBuffer);
    }
  }

  /**
   * @param {number} size
   */
  bindAndUpdate(size) {
    const gl = this.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.byteView.subarray(0, size));
  }
}
