import ModelViewer from '../../viewer';
import ShaderProgram from '../../gl/program';
import Model from './model';
import sources from './shaders';

let shaders = {
  standard: <ShaderProgram | null>null,
};

export default {
  extensions: [['.geo']],
  load(viewer: ModelViewer) {
    shaders.standard = viewer.webgl.createShaderProgram(sources.vs, sources.ps);

    return shaders.standard !== null;
  },
  resource: Model,
  shaders,
};
