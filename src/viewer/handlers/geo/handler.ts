import ModelViewer from '../../viewer';
import ShaderProgram from '../../gl/program';
import Model from './model';
import Batch from './renderbatch';
import ModelInstance from './modelinstance';
import sources from './shaders';

let shaders = {
  standard: <ShaderProgram | null>null,
};

function load(viewer: ModelViewer) {
  shaders.standard = viewer.webgl.createShaderProgram(sources.vs, sources.ps);

  return shaders.standard !== null;
}

export default {
  extensions: [['.geo']],
  Constructor: Model,
  Instance: [ModelInstance],
  Batch: Batch,
  load,
  shaders,
};
