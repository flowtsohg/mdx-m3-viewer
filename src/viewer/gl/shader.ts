import WebGL from './gl';

/**
 * A wrapper around a WebGL shader program.
 */
export default class Shader {
  webgl: WebGL;
  program: WebGLProgram;
  uniforms: {[key: string]: WebGLUniformLocation } = {};
  attribs: {[key: string]: number } = {};
  attribsCount = 0;

  constructor(webgl: WebGL, program: WebGLProgram) {
    this.webgl = webgl;
    this.program = program;

    const gl = webgl.gl;

    for (let i = 0, l = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i < l; i++) {
      const object = gl.getActiveUniform(program, i);

      if (object) {
        if (object.size === 1) {
          this.uniforms[object.name] = <WebGLUniformLocation>gl.getUniformLocation(program, object.name);
        } else {
          const base = object.name.substr(0, object.name.length - 3);

          for (let index = 0; index < object.size; index++) {
            const name = base + '[' + index + ']';

            this.uniforms[name] = <WebGLUniformLocation>gl.getUniformLocation(program, name);
          }
        }
      }
    }

    for (let i = 0, l = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES); i < l; i++) {
      const object = gl.getActiveAttrib(program, i);

      if (object) {
        this.attribsCount += object.size;

        if (object.size === 1) {
          this.attribs[object.name] = gl.getAttribLocation(program, object.name);
        } else {
          const base = object.name.substr(0, object.name.length - 3);

          for (let index = 0; index < object.size; index++) {
            const name = base + '[' + index + ']';

            this.attribs[name] = gl.getAttribLocation(program, name);
          }
        }
      }
    }
  }

  use(): void {
    this.webgl.useShader(this);
  }
}
