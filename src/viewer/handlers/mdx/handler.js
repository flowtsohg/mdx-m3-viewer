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
    this.extendedShader = viewer.webgl.createShaderProgram('#define EXTENDED_BONES\n' + shaders.vsComplex, shaders.fsComplex);
    this.particleShader = viewer.webgl.createShaderProgram(shaders.vsParticles, shaders.fsParticles);
    this.simpleShader = viewer.webgl.createShaderProgram(shaders.vsSimple, shaders.fsSimple);
    this.hdShader = viewer.webgl.createShaderProgram(shaders.vsHd, shaders.fsHd);

    // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
    return this.complexShader.ok && this.extendedShader.ok && this.particleShader.ok && this.simpleShader.ok && this.hdShader;
  },

  extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
  Constructor: Model,
  Batch: Batch,
  Instance: [ComplexInstance, SimpleInstance],

  complexShader: null,
  extendedShader: null,
  simpleShader: null,
  particleShader: null,
  hdShader: null,

  // Team color/glow textures, shared between all models, but loaded with the first model that uses them.
  teamColors: [],
  teamGlows: [],
  // Same as above, but only loaded and used by Reforged models.
  reforgedTeamColors: [],
  reforgedTeamGlows: [],
};
