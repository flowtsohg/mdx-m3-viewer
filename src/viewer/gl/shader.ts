let lineNumberReg = /:(\d+):/g;

/**
 * A wrapper around a WebGL shader unit.
 */
export default class ShaderUnit {
  ok: boolean = false;
  webglResource: WebGLShader;
  src: string;
  shaderType: number;

  constructor(gl: WebGLRenderingContext, src: string, type: number) {
    let id = <WebGLShader>gl.createShader(type);

    this.webglResource = id;
    this.src = src;
    this.shaderType = type;

    gl.shaderSource(id, src);
    gl.compileShader(id);

    if (gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
      this.ok = true;
    } else {
      let error = gl.getShaderInfoLog(id);

      if (error) {
        let lines = src.split('\n');

        console.error('Shader unit failed to compile!');
        console.error(error);

        let lineNumber = lineNumberReg.exec(error);

        while (lineNumber) {
          let integer = parseInt(lineNumber[1]);

          console.error(integer + ': ' + lines[integer - 1]);

          lineNumber = lineNumberReg.exec(error);
        }
      } else {
        console.error('A shader unit failed to compile due to unknown reasons');
      }
    }
  }
}
