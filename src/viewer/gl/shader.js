let lineNumberReg = /:(\d+):/g;

/**
 * A wrapper around a WebGL shader unit.
 */
export default class ShaderUnit {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {string} src
   * @param {number} type
   */
  constructor(gl, src, type) {
    let id = gl.createShader(type);

    /** @member {boolean} */
    this.ok = false;
    /** @member {WebGLShader} */
    this.webglResource = id;
    /** @member {string} */
    this.src = src;
    /** @member {number} */
    this.shaderType = type;

    gl.shaderSource(id, src);
    gl.compileShader(id);

    if (gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
      this.ok = true;
    } else {
      let error = gl.getShaderInfoLog(id);
      let lines = src.split('\n');

      console.error('Shader unit failed to compile!');
      console.error(error);

      let lineNumber = lineNumberReg.exec(error);

      while (lineNumber) {
        let integer = parseInt(lineNumber[1]);

        console.error(integer + ': ' + lines[integer - 1]);

        lineNumber = lineNumberReg.exec(error);
      }
    }
  }
}
