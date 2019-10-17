import {base256ToString} from '../../../common/typecast';
import {decodeDxt1, decodeDxt3, decodeDxt5, decodeRgtc} from '../../../common/dxt';
import Texture from '../../texture';

let DDS_MAGIC = 0x20534444;
let DDSD_MIPMAPCOUNT = 0x20000;
let DDPF_FOURCC = 0x4;
let FOURCC_DXT1 = 0x31545844;
let FOURCC_DXT3 = 0x33545844;
let FOURCC_DXT5 = 0x35545844;
let FOURCC_ATI2 = 0x32495441;

/**
 * A DDS texture handler.
 *
 * Largely based on https://github.com/toji/webctx-texture-utils/blob/master/texture-util/dds.js
 */
export default class DdsTexture extends Texture {
  /**
   * @param {ArrayBuffer} src
   */
  load(src) {
    let gl = this.viewer.gl;
    let compressedTextures = this.viewer.webgl.extensions.compressedTextureS3tc;
    let header = new Int32Array(src, 0, 31);

    if (header[0] !== DDS_MAGIC) {
      throw new Error('Wrong magic number');
    }

    if (!(header[20] & DDPF_FOURCC)) {
      throw new Error('Not DXT');
    }

    let fourCC = header[21];
    let blockBytes;
    let internalFormat;

    if (fourCC === FOURCC_DXT1) {
      blockBytes = 8;
      internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGB_S3TC_DXT1_EXT : null;
    } else if (fourCC === FOURCC_DXT3) {
      blockBytes = 16;
      internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGBA_S3TC_DXT3_EXT : null;
    } else if (fourCC === FOURCC_DXT5) {
      blockBytes = 16;
      internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGBA_S3TC_DXT5_EXT : null;
    } else if (fourCC === FOURCC_ATI2) {
      blockBytes = 16;
      // According to the extension registry, WebGL supports EXT_texture_compression_rgtc.
      // In practice, for some reason I am not aware of, the extension is only supported by Firefox, and then not on Windows.
      // So practically speaking, for now it's kind of pointless to even check for it.
      internalFormat = null;
    } else {
      throw new Error(`Unsupported FourCC: ${base256ToString(fourCC)}`);
    }

    let mipmapCount = 1;

    if (header[2] & DDSD_MIPMAPCOUNT) {
      mipmapCount = Math.max(1, header[7]);
    }

    let width = header[4];
    let height = header[3];
    let dataOffset = header[1] + 4;

    const id = gl.createTexture();

    this.width = width;
    this.height = height;
    this.webglResource = id;

    gl.bindTexture(gl.TEXTURE_2D, id);

    /// Needed for non-square textures for the next to last mipmap, when using the decoders.
    /// I.e.: 1x2 and 2x1.
    /// Why?
    if (width !== height) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    } else {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    }

    for (let i = 0; i < mipmapCount; i++) {
      let dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes;
      let data = new Uint8Array(src, dataOffset, dataLength);

      // Let the GPU handle the compressed data if it supports it.
      // Otherwise, decode the data on the client.
      if (internalFormat) {
        gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, data);
      } else {
        if (fourCC === FOURCC_DXT1) {
          gl.texImage2D(gl.TEXTURE_2D, i, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_SHORT_5_6_5, decodeDxt1(data, width, height));
        } else if (fourCC === FOURCC_DXT3) {
          gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, decodeDxt3(data, width, height));
        } else if (fourCC === FOURCC_DXT5) {
          gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, decodeDxt5(data, width, height));
        } else {
          gl.texImage2D(gl.TEXTURE_2D, i, gl.LUMINANCE_ALPHA, width, height, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, decodeRgtc(data, width, height));
        }
      }

      dataOffset += dataLength;
      width = Math.max(width / 2, 1);
      height = Math.max(height / 2, 1);
    }

    this.viewer.webgl.setTextureMode(gl.REPEAT, gl.REPEAT, gl.LINEAR, mipmapCount > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  }
}
