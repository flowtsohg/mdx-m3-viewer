import ModelViewer from '../../viewer';
import ShaderProgram from '../../gl/program';
import Texture from '../../texture';
import blpHandler from '../blp/handler';
import ddsHandler from '../dds/handler';
import tgaHandler from '../tga/handler';
import Model from './model';
import complexVert from './shaders/complex.vert';
import complexFrag from './shaders/complex.frag';
import particlesVert from './shaders/particles.vert';
import particlesFrag from './shaders/particles.frag';
import simpleVert from './shaders/simple.vert';
import simpleFrag from './shaders/simple.frag';
import hdVert from './shaders/hd.vert';
import hdFrag from './shaders/hd.frag';

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

    shaders.complex = webgl.createShaderProgram(complexVert, complexFrag);
    shaders.extended = webgl.createShaderProgram('#define EXTENDED_BONES\n' + complexVert, complexFrag);
    shaders.particles = webgl.createShaderProgram(particlesVert, particlesFrag);
    shaders.simple = webgl.createShaderProgram(simpleVert, simpleFrag);
    shaders.hd = webgl.createShaderProgram(hdVert, hdFrag);

    return shaders.complex !== null && shaders.extended !== null && shaders.particles !== null && shaders.simple !== null && shaders.hd !== null;
  },
  resource: Model,
  shaders,
  teamColors,
  teamGlows,
  reforgedTeamColors,
  reforgedTeamGlows,
};
