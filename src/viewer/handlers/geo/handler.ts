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
    let webgl = viewer.webgl;

    // RenderBatch.
    if (!webgl.ensureExtension('ANGLE_instanced_arrays')) {
      console.error('GEO: No instanced rendering support!');

      return false;
    }

    shaders.standard = webgl.createShaderProgram(standardVert, standardFrag);

    return shaders.standard !== null;
  },
  resource: Model,
  shaders,
};
