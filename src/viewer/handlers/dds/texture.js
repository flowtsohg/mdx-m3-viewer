import {DdsImage, FOURCC_DXT1, FOURCC_DXT3, FOURCC_DXT5} from '../../../parsers/dds/image';
import Texture from '../../texture';

/**
 * A DDS texture handler.
 */
export default class DdsTexture extends Texture {
  /**
   * @param {ArrayBuffer|DdsImage} bufferOrImage
   * @param {?Object} options
   */
  load(bufferOrImage, options) {
    let image;

    if (bufferOrImage instanceof DdsImage) {
      image = bufferOrParser;
    } else {
      image = new DdsImage(bufferOrImage);
    }

    let viewer = this.viewer;
    let gl = viewer.gl;
    let webgl = viewer.webgl;
    let compressedTextures = webgl.extensions.compressedTextureS3tc;
    let format = image.format;
    let internalFormat = 0;

    if (compressedTextures) {
      if (format === FOURCC_DXT1) {
        internalFormat = compressedTextures.COMPRESSED_RGB_S3TC_DXT1_EXT;
      } else if (format === FOURCC_DXT3) {
        internalFormat = compressedTextures.COMPRESSED_RGBA_S3TC_DXT3_EXT;
      } else if (format === FOURCC_DXT5) {
        internalFormat = compressedTextures.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      }
    }

    let id = gl.createTexture();

    this.width = image.width;
    this.height = image.height;
    this.webglResource = id;

    gl.bindTexture(gl.TEXTURE_2D, id);

    /// Needed for non-square textures for the next to last mipmap, when using the decoders.
    /// I.e.: 1x2 and 2x1.
    /// Why?
    if (image.width !== image.height) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    } else {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    }

    let mipmaps = image.mipmaps();

    for (let i = 0; i < mipmaps; i++) {
      // Let the GPU handle the compressed data if it supports it.
      // Otherwise, decode the data on the client.
      let {width, height, data} = image.getMipmap(i, !internalFormat);

      if (internalFormat) {
        gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, data);
      } else if (format === FOURCC_DXT1) {
        gl.texImage2D(gl.TEXTURE_2D, i, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_SHORT_5_6_5, data);
      } else if (format === FOURCC_DXT3) {
        gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      } else if (format === FOURCC_DXT5) {
        gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, i, gl.LUMINANCE_ALPHA, width, height, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, data);
      }
    }

    webgl.setTextureMode(gl.REPEAT, gl.REPEAT, gl.LINEAR, mipmaps > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  }
}
