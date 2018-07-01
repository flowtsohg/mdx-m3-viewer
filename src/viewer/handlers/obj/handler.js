import ObjModel from './model';
import ModelView from '../../modelview';
import Bucket from '../../bucket';
import ObjModelInstance from './modelinstance';
import shaders from './shaders';


export default {
  load(viewer) {
    let shader = viewer.loadShader('ObjShader', shaders.vs, shaders.ps);

    // Returning false will not allow the handler to be added.
    // In this case, this should happen when the shader fails to compile.
    return shader.ok;
  },

  extensions: [['.obj', 'text']],
  Constructor: ObjModel,
  View: ModelView,
  Bucket: Bucket,
  Instance: ObjModelInstance,
};
