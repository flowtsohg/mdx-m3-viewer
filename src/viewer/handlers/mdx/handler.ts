import { isStringInBytes, isStringInString } from '../../../common/isstringin';
import MdlxModel from '../../../parsers/mdlx/model';
import ModelViewer from '../../viewer';
import Model from './model';
import MdxTexture from './texture';
import standardVert from './shaders/standard.vert';
import standardFrag from './shaders/standard.frag';
import hdVert from './shaders/hd.vert';
import hdFrag from './shaders/hd.frag';
import particlesVert from './shaders/particles.vert';
import particlesFrag from './shaders/particles.frag';

export default {
  load(viewer: ModelViewer) {
    let gl = viewer.gl;
    let webgl = viewer.webgl;

    // Bone textures.
    if (!webgl.ensureExtension('OES_texture_float')) {
      console.error('MDX: No float texture support!');

      return false;
    }

    // Geometry emitters.
    if (!webgl.ensureExtension('ANGLE_instanced_arrays')) {
      console.error('MDX: No instanced rendering support!');

      return false;
    }

    let standardShader = webgl.createShaderProgram(standardVert, standardFrag);
    let extendedShader = webgl.createShaderProgram('#define EXTENDED_BONES\n' + standardVert, standardFrag);
    let hdShader = webgl.createShaderProgram(hdVert, hdFrag);
    let particlesShader = webgl.createShaderProgram(particlesVert, particlesFrag);

    let rectBuffer = <WebGLBuffer>gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    viewer.sharedCache.set('mdx', {
      // Shaders.
      standardShader,
      extendedShader,
      hdShader,
      particlesShader,
      // Geometry emitters buffer.
      rectBuffer,
      // Team color/glow textures, shared between all non-Reforged models, but loaded with the first model that uses them.
      teamColors: <MdxTexture[]>[],
      teamGlows: <MdxTexture[]>[],
      // Same as above, but only loaded and used by Reforged models.
      reforgedTeamColors: <MdxTexture[]>[],
      reforgedTeamGlows: <MdxTexture[]>[],
    });

    return standardShader !== null && extendedShader !== null && hdShader !== null && particlesShader !== null;
  },
  isValidSource(src: any) {
    if (src instanceof MdlxModel) {
      return true;
    }

    if (src instanceof ArrayBuffer) {
      let bytes = new Uint8Array(src);

      // MDLX
      if (bytes[0] === 0x4D && bytes[1] === 0x44 && bytes[2] === 0x4C && bytes[3] === 0x58) {
        return true;
      }

      // Or attempt to match against MDL by looking for FormatVersion in the first 4KB.
      if (isStringInBytes('FormatVersion', bytes, 0, 4096)) {
        return true;
      }
    }

    // If the source is a string, look for FormatVersion same as above.
    if (typeof src === 'string' && isStringInString('FormatVersion', src, 0, 4096)) {
      return true;
    }

    return false;
  },
  resource: Model,
};
