import Parser from '../../../parsers/m3/model';
import ModelViewer from '../../viewer';
import ShaderProgram from '../../gl/program';
import Model from './model';
import standardVert from './shaders/standard.vert';
import standardFrag from './shaders/standard.frag';

export default {
  load(viewer: ModelViewer) {
    let gl = viewer.gl;
    let webgl = viewer.webgl;
    let teamColors = [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]];

    // Bone textures.
    if (!webgl.ensureExtension('OES_texture_float')) {
      throw new Error('M3: No float texture support!');
    }

    let standardShaders = <ShaderProgram[]>[];

    // Load shaders for 1-4 texture coordinate models.
    for (let i = 0; i < 4; i++) {
      let shader = webgl.createShaderProgram(`#define EXPLICITUV${i}\n${standardVert}`, standardFrag);

      if (shader === null) {
        throw new Error('M3: Failed to compile a shader!');
      }

      // Bind the shader and set the team color uniforms.
      webgl.useShaderProgram(shader);

      for (let i = 0; i < 14; i++) {
        let color = teamColors[i];

        gl.uniform3f(shader.uniforms['u_teamColors[' + i + ']'], color[0] / 255, color[1] / 255, color[2] / 255);
      }

      standardShaders[i] = shader;
    }

    viewer.sharedCache.set('m3', {
      standardShaders,
      lightPosition: new Float32Array([0, 0, 10000]),
    });
  },
  isValidSource(src: any) {
    if (src instanceof Parser) {
      return true;
    }

    if (src instanceof ArrayBuffer) {
      let buffer = new Uint32Array(src, 0, 1);

      // MD34.
      if (buffer[0] === 0x4d443334) {
        return true;
      }
    }

    return false;
  },
  resource: Model,
};
