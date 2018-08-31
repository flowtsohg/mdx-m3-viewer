import dds from '../dds/handler';
import tga from '../tga/handler';
import Model from './model';
import ModelView from './modelview';
import Bucket from './bucket';
import ModelInstance from './modelinstance';
import shaders from './shaders';

/**
 * @param {ModelViewer} viewer
 * @param {ShaderProgram} shader
 */
function initializeTeamColors(viewer, shader) {
  let webgl = viewer.webgl;
  let gl = viewer.gl;
  let teamColors = [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]];

  webgl.useShaderProgram(shader);

  for (let i = 0; i < 14; i++) {
    let color = teamColors[i];

    gl.uniform3fv(shader.uniforms['u_teamColors[' + i + ']'], [color[0] / 255, color[1] / 255, color[2] / 255]);
  }
}

export default {
  load(viewer) {
    viewer.addHandler(dds);
    viewer.addHandler(tga);

    // Load shaders for 1-4 texture coordinate models.
    for (let i = 0; i < 4; i++) {
      let shader = viewer.loadShader(`M3StandardShader${i}`, `#define EXPLICITUV${i}\n${shaders.vs}`, shaders.fs);

      // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
      if (!shader.ok) {
        return false;
      }

      initializeTeamColors(viewer, shader);
    }

    return true;
  },

  extensions: [['.m3', 'arrayBuffer']],
  Constructor: Model,
  View: ModelView,
  Bucket: Bucket,
  Instance: ModelInstance,
  lightPosition: new Float32Array([0, 0, 10000]),
};
