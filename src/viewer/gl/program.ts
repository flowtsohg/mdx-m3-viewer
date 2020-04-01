import WebGL from './gl';
import ShaderUnit from './shader';

/**
 * A wrapper around a WebGL shader program.
 */
export default class ShaderProgram {
  ok: boolean = false;
  webgl: WebGL;
  webglResource: WebGLProgram;
  shaders: ShaderUnit[];
  uniforms: { [key: string]: WebGLUniformLocation } = {};
  attribs: NumberObject = {};
  attribsCount: number = 0;

  constructor(webgl: WebGL, vertexShader: ShaderUnit, fragmentShader: ShaderUnit) {
    let gl = webgl.gl;
    let id = <WebGLProgram>gl.createProgram();

    this.webgl = webgl;
    this.webglResource = id;
    this.shaders = [vertexShader, fragmentShader];

    gl.attachShader(id, vertexShader.webglResource);
    gl.attachShader(id, fragmentShader.webglResource);
    gl.linkProgram(id);

    if (gl.getProgramParameter(id, gl.LINK_STATUS)) {
      for (let i = 0, l = gl.getProgramParameter(id, gl.ACTIVE_UNIFORMS); i < l; i++) {
        let object = gl.getActiveUniform(id, i);

        if (object) {
          if (object.size === 1) {
            this.uniforms[object.name] = <WebGLUniformLocation>gl.getUniformLocation(id, object.name);
          } else {
            let base = object.name.substr(0, object.name.length - 3);

            for (let index = 0; index < object.size; index++) {
              let name = base + '[' + index + ']';

              this.uniforms[name] = <WebGLUniformLocation>gl.getUniformLocation(id, name);
            }
          }
        }
      }

      for (let i = 0, l = gl.getProgramParameter(id, gl.ACTIVE_ATTRIBUTES); i < l; i++) {
        let object = gl.getActiveAttrib(id, i);

        if (object) {
          this.attribsCount += object.size;

          if (object.size === 1) {
            this.attribs[object.name] = gl.getAttribLocation(id, object.name);
          } else {
            let base = object.name.substr(0, object.name.length - 3);

            for (let index = 0; index < object.size; index++) {
              let name = base + '[' + index + ']';

              this.attribs[name] = gl.getAttribLocation(id, name);
            }
          }
        }
      }

      this.ok = true;
    } else {
      console.error('Shader program failed to link!');
      console.error(gl.getProgramInfoLog(id));
    }
  }

  use() {
    this.webgl.useShaderProgram(this);
  }
}
