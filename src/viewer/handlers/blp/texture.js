import Parser from '../../../parsers/blp/texture';
import {scaleNPOT} from '../../../common/canvas';
import Texture from '../../texture';

/**
 * A BLP texure handler.
 */
export default class BlpTexture extends Texture {
  /**
   * @param {ArrayBuffer} src
   */
  load(src) {
    let parser = new Parser();
    parser.load(src);

    let gl = this.viewer.gl;

    // Upscale to POT if the size is NPOT.
    let imageData = scaleNPOT(parser.getMipmap(0));

    // NOTE: BGRA data, it gets sizzled in the shader.
    //       I feel like the noticeable slow down when sizzling once on the client side isn't worth it.
    let id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, id);
    this.viewer.webgl.setTextureMode(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.parser = parser;
    this.imageData = imageData;
    this.width = imageData.width; // Note: might not be the same as 'width' and 'height' due to NPOT upscaling.
    this.height = imageData.height;
    this.webglResource = id;
  }
}
