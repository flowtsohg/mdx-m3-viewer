import Parser from '../../../parsers/m3/model';
import isM3 from '../../../parsers/m3/isformat';
import ModelViewer from '../../viewer';
import Shader from '../../gl/shader';
import Model from './model';
import standardVert from './shaders/standard.vert';
import standardFrag from './shaders/standard.frag';

export interface M3HandlerObject {
  standardShaders: Shader[];
}

export default {
  load(viewer: ModelViewer): void {
    const gl = viewer.gl;
    const webgl = viewer.webgl;
    const teamColors = [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]];

    // Bone textures.
    if (!webgl.ensureExtension('OES_texture_float')) {
      throw new Error('M3: No float texture support!');
    }

    const standardShaders = <Shader[]>[];

    // Load shaders for 1-4 texture coordinate models.
    for (let i = 0; i < 4; i++) {
      const shader = webgl.createShader(`#define EXPLICITUV${i}\n${standardVert}`, standardFrag);

      // Bind the shader and set the team color uniforms.
      shader.use();

      for (let i = 0; i < 14; i++) {
        const color = teamColors[i];

        gl.uniform3f(shader.uniforms['u_teamColors[' + i + ']'], color[0] / 255, color[1] / 255, color[2] / 255);
      }

      standardShaders[i] = shader;
    }

    const handlerData: M3HandlerObject = { standardShaders };

    viewer.sharedCache.set('m3', handlerData);
  },
  isValidSource(object: unknown): boolean {
    if (object instanceof Parser) {
      return true;
    }

    return isM3(object);
  },
  resource: Model,
};
