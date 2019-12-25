import ModelViewer from '../../viewer';
import ShaderProgram from '../../gl/program';
import Model from './model';
import standardVert from './shaders/standard.vert';
import standardFrag from './shaders/standard.frag';

let shaders = {
  standard: <ShaderProgram | null>null,
};

export default {
  extensions: [['.geo']],
  load(viewer: ModelViewer) {
    shaders.standard = viewer.webgl.createShaderProgram(standardVert, standardFrag);

    return shaders.standard !== null;
  },
  resource: Model,
  shaders,
};
