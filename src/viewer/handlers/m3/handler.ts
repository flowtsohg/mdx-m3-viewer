import ModelViewer from '../../viewer';
import ShaderProgram from '../../gl/program';
import dds from '../dds/handler';
import tga from '../tga/handler';
import Model from './model';
import ModelInstance from './modelinstance';
import sources from './shaders';

let shaders = {
  standard: <ShaderProgram[]>[],
};

let teamColors = [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]];

function load(viewer: ModelViewer) {
  let gl = viewer.gl;
  let webgl = viewer.webgl;

  viewer.addHandler(dds);
  viewer.addHandler(tga);

  // Load shaders for 1-4 texture coordinate models.
  for (let i = 0; i < 4; i++) {
    let shader = webgl.createShaderProgram(`#define EXPLICITUV${i}\n${sources.vs}`, sources.fs);

    // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
    if (!shader) {
      return false;
    }

    // Bind the shader and set the team color uniforms.
    webgl.useShaderProgram(shader);

    for (let i = 0; i < 14; i++) {
      let color = teamColors[i];

      gl.uniform3f(shader.uniforms['u_teamColors[' + i + ']'], color[0] / 255, color[1] / 255, color[2] / 255);
    }

    shaders.standard[i] = shader;
  }

  return true;
}

export default {
  extensions: [['.m3', 'arrayBuffer']],
  Constructor: Model,
  Instance: [ModelInstance],
  load,
  lightPosition: new Float32Array([0, 0, 10000]),
  shaders,
};
