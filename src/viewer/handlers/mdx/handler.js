import blp from '../blp/handler';
import tga from '../tga/handler';
import imagetexture from '../imagetexture/handler';
import Model from './model';
import Batch from './renderbatch';
import ComplexInstance from './complexinstance';
import SimpleInstance from './simpleinstance';
import shaders from './shaders';

export default {
  load(viewer) {
    viewer.addHandler(blp);
    viewer.addHandler(tga);
    viewer.addHandler(imagetexture);

    this.complexShader = viewer.webgl.createShaderProgram(shaders.vsComplex, shaders.fsComplex);
    this.simpleShader = viewer.webgl.createShaderProgram(shaders.vsSimple, shaders.fsSimple);
    //this.instancedShader = viewer.webgl.createShaderProgram(shaders.vs, shaders.fs);
    this.particleShader = viewer.webgl.createShaderProgram(shaders.vsParticles, shaders.fsParticles);

    // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
    return this.complexShader.ok && this.simpleShader.ok && this.particleShader.ok;
  },

  extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
  Constructor: Model,
  Batch: Batch,
  Instance: [ComplexInstance, SimpleInstance],

  complexShader: null,
  simpleShader: null,
  particleShader: null,

  // Team color/glow textures, shared between all models, but loaded with the first model that uses them.
  teamColors: [],
  teamGlows: [],
};
