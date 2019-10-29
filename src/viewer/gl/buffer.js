import {powerOfTwo} from '../../common/math';

/**
 * A buffer.
 */
export default class Buffer {
  /**
   * @param {WebGLRenderingContext} gl
   */
  constructor(gl) {
    /** @member {WebGLRenderingContext} */
    this.gl = gl;
    /** @member {ArrayBuffer} */
    this.arrayBuffer = new ArrayBuffer(0);
    /** @member {?Uint8Array} */
    this.byteView = null;
    /** @member {?Float32Array} */
    this.floatView = null;
    /** @member {WebGLBuffer} */
    this.buffer = gl.createBuffer();
  }

  /**
   * @return {number}
   */
  size() {
    return this.arrayBuffer.byteLength;
  }

  /**
  * @param {number} size
  */
  resize(size) {
    if (this.arrayBuffer.byteLength < size) {
      const gl = this.gl;

      this.arrayBuffer = new ArrayBuffer(powerOfTwo(size));
      this.byteView = new Uint8Array(this.arrayBuffer);
      this.floatView = new Float32Array(this.arrayBuffer);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.arrayBuffer.byteLength, gl.DYNAMIC_DRAW);
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
