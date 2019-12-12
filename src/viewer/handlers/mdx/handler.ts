import ModelViewer from '../../viewer';
import ShaderProgram from '../../gl/program';
import Texture from '../../texture';
import blpHandler from '../blp/handler';
import ddsHandler from '../dds/handler';
import tgaHandler from '../tga/handler';
import Model from './model';
import sources from './shaders';

// Shaders.
let shaders = {
  complex: <ShaderProgram | null>null,
  extended: <ShaderProgram | null>null,
  simple: <ShaderProgram | null>null,
  particles: <ShaderProgram | null>null,
  hd: <ShaderProgram | null>null,
};

// Team color/glow textures, shared between all non-Reforged models, but loaded with the first model that uses them.
let teamColors = <Texture[]>[];
let teamGlows = <Texture[]>[];

// Same as above, but only loaded and used by Reforged models.
let reforgedTeamColors = <Texture[]>[];
let reforgedTeamGlows = <Texture[]>[];

export default {
  extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
  load(viewer: ModelViewer) {
    let webgl = viewer.webgl;

    viewer.addHandler(blpHandler);
    viewer.addHandler(ddsHandler);
    viewer.addHandler(tgaHandler);

    shaders.complex = webgl.createShaderProgram(sources.vsComplex, sources.fsComplex);
    shaders.extended = webgl.createShaderProgram('#define EXTENDED_BONES\n' + sources.vsComplex, sources.fsComplex);
    shaders.particles = webgl.createShaderProgram(sources.vsParticles, sources.fsParticles);
    shaders.simple = webgl.createShaderProgram(sources.vsSimple, sources.fsSimple);
    shaders.hd = webgl.createShaderProgram(sources.vsHd, sources.fsHd);

    return shaders.complex !== null && shaders.extended !== null && shaders.particles !== null && shaders.simple !== null && shaders.hd !== null;
  },
  resource: Model,
  shaders,
  teamColors,
  teamGlows,
  reforgedTeamColors,
  reforgedTeamGlows,
};
