import ModelView from './modelview';
import Model from './model';
import Bucket from './bucket';
import ModelInstance from './modelinstance';
import shaders from './shaders';

export default {
  load(viewer) {
    let shader = viewer.loadShader('GeoStandardShader', shaders.vs, shaders.ps);

    // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
    return shader.ok;
  },

  extensions: [['.geo']],
  Constructor: Model,
  View: ModelView,
  Bucket: Bucket,
  Instance: ModelInstance,
};
