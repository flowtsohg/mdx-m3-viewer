import ModelViewer from '../../viewer';
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

export default {
  extensions: [['.mdx', 'arrayBuffer'], ['.mdl', 'text']],
  load(viewer: ModelViewer) {
    let webgl = viewer.webgl;

    // Bone textures.
    if (!webgl.ensureExtension('OES_texture_float')) {
      console.error('MDX: No float texture support!');

      return false;
    }

    // Geometry emitters and RenderBatch.
    if (!webgl.ensureExtension('ANGLE_instanced_arrays')) {
      console.error('MDX: No instanced rendering support!');

      return false;
    }

    viewer.addHandler(blpHandler);
    viewer.addHandler(ddsHandler);
    viewer.addHandler(tgaHandler);

    let complexShader = webgl.createShaderProgram(complexVert, complexFrag);
    let extendedShader = webgl.createShaderProgram('#define EXTENDED_BONES\n' + complexVert, complexFrag);
    let particlesShader = webgl.createShaderProgram(particlesVert, particlesFrag);
    let simpleShader = webgl.createShaderProgram(simpleVert, simpleFrag);
    let hdShader = webgl.createShaderProgram(hdVert, hdFrag);

    viewer.sharedCache.set('mdx', {
      // Shaders.
      complexShader,
      extendedShader,
      particlesShader,
      simpleShader,
      hdShader,
      // Team color/glow textures, shared between all non-Reforged models, but loaded with the first model that uses them.
      teamColors: <Texture[]>[],
      teamGlows: <Texture[]>[],
      // Same as above, but only loaded and used by Reforged models.
      reforgedTeamColors: <Texture[]>[],
      reforgedTeamGlows: <Texture[]>[],
    });

    return complexShader !== null && extendedShader !== null && particlesShader !== null && simpleShader !== null && hdShader !== null;
  },
  resource: Model,
};
