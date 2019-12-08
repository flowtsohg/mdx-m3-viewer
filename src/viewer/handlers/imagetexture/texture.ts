import { imageToImageData, scaleNPOT } from '../../../common/canvas';
import Texture from '../../texture';

/**
 * A texture handler for image sources.
 */
export default class ImageTexture extends Texture {
  load(src: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageData | WebGLTexture) {
    // src can either be an Image, or an ArrayBuffer, depending on the way it was loaded
    if (src instanceof HTMLImageElement || src instanceof HTMLVideoElement || src instanceof HTMLCanvasElement || src instanceof ImageData) {
      let gl = this.viewer.gl;
      let imageData;

      if (src instanceof ImageData) {
        imageData = src;
      } else {
        imageData = imageToImageData(src);
      }

      // Upscale to POT if the size is NPOT.
      imageData = scaleNPOT(imageData);

      let id = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, id);
      this.viewer.webgl.setTextureMode(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
      gl.generateMipmap(gl.TEXTURE_2D);

      this.width = imageData.width; // Note: might not be the same as 'image.width' and 'image.height' due to NPOT upscaling.
      this.height = imageData.height;
      this.webglResource = id;
    } else if (src instanceof WebGLTexture) {
      this.webglResource = src;
    }
  }
}
