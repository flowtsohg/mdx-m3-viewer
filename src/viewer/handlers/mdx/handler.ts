import MdlxModel from '../../../parsers/mdlx/model';
import { isMdx, isMdl } from '../../../parsers/mdlx/isformat';
import ModelViewer from '../../viewer';
import { PathSolver } from '../../handlerresource';
import Texture from '../../texture';
import Model from './model';
import MdxTexture from './texture';
import standardVert from './shaders/standard.vert';
import standardFrag from './shaders/standard.frag';
import hdVert from './shaders/hd.vert';
import hdFrag from './shaders/hd.frag';
import particlesVert from './shaders/particles.vert';
import particlesFrag from './shaders/particles.frag';

export default {
  load(viewer: ModelViewer, pathSolver?: PathSolver, reforgedTeams?: boolean) {
    let gl = viewer.gl;
    let webgl = viewer.webgl;

    // Bone textures.
    if (!webgl.ensureExtension('OES_texture_float')) {
      throw new Error('MDX: No float texture support!');
    }

    // Geometry emitters.
    if (!webgl.ensureExtension('ANGLE_instanced_arrays')) {
      throw new Error('MDX: No instanced rendering support!');
    }

    let standardShader = webgl.createShader(standardVert, standardFrag);
    let extendedShader = webgl.createShader('#define EXTENDED_BONES\n' + standardVert, standardFrag);
    let hdShader = webgl.createShader(hdVert, hdFrag);
    let particlesShader = webgl.createShader(particlesVert, particlesFrag);

    let rectBuffer = <WebGLBuffer>gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    let teamColors: MdxTexture[] = [];
    let teamGlows: MdxTexture[] = [];
    let teams = reforgedTeams ? 28 : 14;
    let ext = reforgedTeams ? 'dds' : 'blp';
    let params = reforgedTeams ? { reforged: true } : {};

    for (let i = 0; i < teams; i++) {
      let id = ('' + i).padStart(2, '0');
      let end = `${id}.${ext}`;

      let teamColor = new MdxTexture(1, true, true);
      let teamGlow = new MdxTexture(2, true, true);

      viewer.load(`ReplaceableTextures\\TeamColor\\TeamColor${end}`, pathSolver, params)
        .then((texture) => teamColor.texture = <Texture>texture);

      viewer.load(`ReplaceableTextures\\TeamGlow\\TeamGlow${end}`, pathSolver, params)
        .then((texture) => teamGlow.texture = <Texture>texture);

      teamColors[i] = teamColor;
      teamGlows[i] = teamGlow;
    }

    viewer.sharedCache.set('mdx', {
      // Shaders.
      standardShader,
      extendedShader,
      hdShader,
      particlesShader,
      // Geometry emitters buffer.
      rectBuffer,
      // Team color/glow textures.
      teamColors,
      teamGlows,
    });
  },
  isValidSource(object: any) {
    if (object instanceof MdlxModel) {
      return true;
    }

    return isMdx(object) || isMdl(object);
  },
  resource: Model,
};
