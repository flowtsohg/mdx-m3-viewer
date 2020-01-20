/**
 * A data texture.
 */
export default class DataTexture {
  gl: WebGLRenderingContext;
  texture: WebGLTexture;
  format: number;
  width: number = 0;
  height: number = 0;

  constructor(gl: WebGLRenderingContext, channels: number = 4, width: number = 1, height: number = 1) {
    this.gl = gl;
    this.texture = <WebGLTexture>gl.createTexture();
    this.format = (channels === 3 ? gl.RGB : gl.RGBA);

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
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, gl.FLOAT, null);
    }
  }

  bindAndUpdate(buffer: TypedArray, width: number = this.width, height: number = this.height) {
    const gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, this.format, gl.FLOAT, buffer);
  }

  bind(unit: number) {
    const gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }
}
