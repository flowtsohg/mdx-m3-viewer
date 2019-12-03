/**
 * A data texture.
 */
export default class ClientDataTexture {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {?number} width
   * @param {?number} height
   */
  constructor(gl, width = 2, height = 2) {
    /** @member {WebGLRenderingContext} */
    this.gl = gl;
    /** @member {WebGLBuffer} */
    this.texture = gl.createTexture();
    /** @member {number} */
    this.width = 0;
    /** @member {number} */
    this.height = 0;
    /** @member {ArrayBuffer} */
    this.arrayBuffer = new ArrayBuffer(0);
    /** @member {?Uint8Array} */
    this.byteView = null;
    /** @member {?Float32Array} */
    this.floatView = null;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    this.reserve(width, height);
  }

  /**
  * @param {number} width
  * @param {number} height
  */
  reserve(width, height) {
    if (this.width < width || this.height < this.height) {
      const gl = this.gl;

      this.width = Math.max(this.width, width);
      this.height = Math.max(this.height, height);

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null);

      this.arrayBuffer = new ArrayBuffer(this.width * this.height * 16);
      this.byteView = new Uint8Array(this.arrayBuffer);
      this.floatView = new Float32Array(this.arrayBuffer);
    }
  }

  /**
  * @param {?number} width
  * @param {?number} height
  */
  bindAndUpdate(width = this.width, height = this.height) {
    const gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.FLOAT, this.arrayBuffer);
  }
}
