/**
 * A data texture.
 */
export default class ClientDataTexture {
  gl: WebGLRenderingContext;
  texture: WebGLTexture;
  width: number = 0;
  height: number = 0;
  arrayBuffer: ArrayBuffer = new ArrayBuffer(0);;
  byteView: Uint8Array | null = null;
  floatView: Float32Array | null = null;

  constructor(gl: WebGLRenderingContext, width: number = 1, height: number = 1) {
    this.gl = gl;
    this.texture = <WebGLTexture>gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    this.reserve(width, height);
  }

  reserve(width: number, height: number) {
    if (this.width < width || this.height < height) {
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

  bindAndUpdate(width: number = this.width, height: number = this.height) {
    const gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.FLOAT, this.byteView);
  }
}
