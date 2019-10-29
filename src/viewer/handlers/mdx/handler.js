import TexturedModelView from '../../texturedmodelview';
import blp from '../blp/handler';
import tga from '../tga/handler';
import imagetexture from '../imagetexture/handler';
import Model from './model';
import ModelViewData from './modelviewdata';
import Bucket from './bucket';
import ModelInstance from './modelinstance';
import shaders from './shaders';

export default {
  load(viewer) {
    viewer.addHandler(blp);
    viewer.addHandler(tga);
    viewer.addHandler(imagetexture);

    let standardShader = viewer.loadShader('MdxStandardShader', shaders.vsNew, shaders.fsNew);
    let instancedShader = viewer.loadShader('MdxInstancedShader', shaders.vs, shaders.fs);
    let particleShader = viewer.loadShader('MdxParticleShader', shaders.vsParticles, shaders.fsParticles);

    // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.

    return standardShader.ok && instancedShader.ok && particleShader.ok;
  },

  extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
  Constructor: Model,
  View: TexturedModelView,
  Data: ModelViewData,
  Bucket: Bucket,
  Instance: ModelInstance,
  // Team color/glow textures, shared between all models, but loaded with the first model that uses them.
  teamColors: [],
  teamGlows: [],
  teamColorsAtlas: null,
  teamGlowsAtlas: null,
};
