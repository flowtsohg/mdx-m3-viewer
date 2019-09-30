import Parser from '../../../parsers/blp/texture';
import Texture from '../../texture';

/**
 * A BLP texure handler.
 */
export default class BlpTexture extends Texture {
  /**
   * @param {ArrayBuffer|Parser} bufferOrParser
   * @param {?Object} options
   */
  load(bufferOrParser, options) {
    let parser;

    if (bufferOrParser instanceof Parser) {
      parser = bufferOrParser;
    } else {
      parser = new Parser(bufferOrParser);
    }

    let viewer = this.viewer;
    let gl = viewer.gl;

    let id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, id);

    let wrapS = gl.CLAMP_TO_EDGE;
    let wrapT = gl.CLAMP_TO_EDGE;

    if (options) {
      if (options.wrapS) {
        wrapS = gl.REPEAT;
      }

      if (options.wrapT) {
        wrapT = gl.REPEAT;
      }
    }

    viewer.webgl.setTextureMode(wrapS, wrapT, gl.LINEAR, gl.LINEAR);

    let imageData = parser.getMipmap(0);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

    /// TODO: What to do with fake mipmaps?
    // let mipmaps = parser.mipmaps();

    // viewer.webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, mipmaps > 1 ? gl.LINEAR : gl.LINEAR);

    // for (let i = 0; i < mipmaps; i++) {
    //   let imageData = parser.getMipmap(i);

    //   if (i === 0) {
    //     this.imageData = imageData;
    //     this.width = imageData.width; // Note: might not be the same as 'width' and 'height' due to NPOT upscaling.
    //     this.height = imageData.height;
    //   }

    //   gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    // }

    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
    this.webglResource = id;
  }
}
