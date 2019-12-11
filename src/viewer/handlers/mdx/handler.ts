import ModelViewer from '../../viewer';
import blp from '../blp/handler';
import tga from '../tga/handler';
import imagetexture from '../imagetexture/handler';
import Model from './model';
import Batch from './renderbatch';
import ComplexInstance from './complexinstance';
import SimpleInstance from './simpleinstance';
import sources from './shaders';
import ShaderProgram from '../../gl/program';
import Texture from '../../texture';

// Shaders.
let shaders = {
  complex: <ShaderProgram | null>null,
  extended: <ShaderProgram | null>null,
  simple: <ShaderProgram | null>null,
  particles: <ShaderProgram | null>null,
  hd: <ShaderProgram | null>null,
};

// Team color/glow textures, shared between all models, but loaded with the first model that uses them.
let teamColors = <Texture[]>[];
let teamGlows = <Texture[]>[];

// Same as above, but only loaded and used by Reforged models.
let reforgedTeamColors = <Texture[]>[];
let reforgedTeamGlows = <Texture[]>[];

// Handler loader.
function load(viewer: ModelViewer) {
  let webgl = viewer.webgl;

  viewer.addHandler(blp);
  viewer.addHandler(tga);
  viewer.addHandler(imagetexture);

  shaders.complex = webgl.createShaderProgram(sources.vsComplex, sources.fsComplex);
  shaders.extended = webgl.createShaderProgram('#define EXTENDED_BONES\n' + sources.vsComplex, sources.fsComplex);
  shaders.particles = webgl.createShaderProgram(sources.vsParticles, sources.fsParticles);
  shaders.simple = webgl.createShaderProgram(sources.vsSimple, sources.fsSimple);
  shaders.hd = webgl.createShaderProgram(sources.vsHd, sources.fsHd);

  // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
  return shaders.complex && shaders.extended && shaders.particles && shaders.simple && shaders.hd;
}

export default {
  extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
  Constructor: Model,
  Batch: Batch,
  Instance: [ComplexInstance, SimpleInstance],
  load,
  shaders,
  teamColors,
  teamGlows,
  reforgedTeamColors,
  reforgedTeamGlows,
};
