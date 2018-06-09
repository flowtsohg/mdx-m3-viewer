import Blp from '../blp/handler';
import Tga from '../tga/handler';
import Slk from '../slk/handler';
import ImageTexture from '../imagetexture/handler';
import Model from './model';
import ModelView from './modelview';
import Bucket from './bucket';
import ModelInstance from './modelinstance';
import shaders from './shaders';

export default {
  load(viewer) {
    viewer.addHandler(Blp);
    viewer.addHandler(Tga);
    viewer.addHandler(Slk);
    viewer.addHandler(ImageTexture);

    let standardShader = viewer.loadShader('MdxStandardShader', shaders.vs, shaders.ps);
    let particleShader = viewer.loadShader('MdxParticleShader', shaders.vsParticles, shaders.psParticles);

    // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
    return standardShader.loaded && particleShader.loaded;
  },

  extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
  Constructor: Model,
  View: ModelView,
  Bucket: Bucket,
  Instance: ModelInstance,
};
