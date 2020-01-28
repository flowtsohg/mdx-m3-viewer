import ModelViewer from '../../viewer';
import Model from './model';
import standardVert from './shaders/standard.vert';
import standardFrag from './shaders/standard.frag';

export default {
  extensions: [['.geo']],
  load(viewer: ModelViewer) {
    let webgl = viewer.webgl;

    // RenderBatch.
    if (!webgl.ensureExtension('ANGLE_instanced_arrays')) {
      console.error('GEO: No instanced rendering support!');

      return false;
    }

    let shader = webgl.createShaderProgram(standardVert, standardFrag);

    viewer.sharedCache.set('geo', {
      shader,
    });

    return shader !== null;
  },
  resource: Model,
};
