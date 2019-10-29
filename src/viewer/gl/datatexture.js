/**
 * A data texture.
 */
export default class DataTexture {
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
    this.texture = gl.createTexture();
    /** @member {number} */
    this.width = 2;
    /** @member {number} */
    this.height = 2;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  }

  /**
  * @param {number} width
  * @param {number} height
  */
  resize(width, height) {
    if (this.width < width || this.height < this.height) {
      const gl = this.gl;

      this.arrayBuffer = new ArrayBuffer();
      this.byteView = new Uint8Array(this.arrayBuffer);
      this.floatView = new Float32Array(this.arrayBuffer);

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, Math.max(width, this.width), Math.max(height, this.height), 0, gl.RGBA, gl.FLOAT, null);
    }
  }

  /**
  * @param {number} width
  * @param {number} height
  */
  bindAndUpdate(width, height) {
    const gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.FLOAT, this.arrayBuffer);
  }
}
