import { scaleNPOT } from '../../../common/canvas';
import Texture from '../../texture';

/**
 * A TGA texture handler.
 */
export default class TgaTexture extends Texture {
  load(src: ArrayBuffer) {
    let gl = this.viewer.gl;
    let dataView = new DataView(src);
    let imageType = dataView.getUint8(2);

    if (imageType !== 2) {
      throw new Error('Unsupported image type');
    }

    let width = dataView.getUint16(12, true);
    let height = dataView.getUint16(14, true);
    let pixelDepth = dataView.getUint8(16);

    if (pixelDepth !== 32) {
      throw new Error('Unsupported bits per pixel');
    }

    // Upscale to POT if the size is NPOT.
    let imageData = scaleNPOT(new ImageData(new Uint8ClampedArray(src, 18, width * height * 4), width, height));

    let id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, id);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

    this.width = imageData.width; // Note: might not be the same as 'width' and 'height' due to NPOT upscaling.
    this.height = imageData.height;
    this.webglResource = id;
  }
}
