import { powerOfTwo } from '../common/math';
import { imageToImageData, scaleNPOT } from '../common/canvas';
import Texture from './texture';

/**
 * Checks if the given source is a supported image texture source.
 */
export function isImageSource(src: any) {
  return src instanceof ImageData || src instanceof HTMLImageElement || src instanceof HTMLCanvasElement || src instanceof HTMLVideoElement;
}

/**
 * Checks if the given extension is a supported image texture extension.
 */
export function isImageExtension(ext: string) {
  return ext === '.png' || ext === '.jpg' || ext === '.gif';
}

/**
 * A texture handler for image sources.
 */
export class ImageTexture extends Texture {
  load(src: TexImageSource) {
    let widthPOT = powerOfTwo(src.width);
    let heightPOT = powerOfTwo(src.height);

    if (widthPOT !== src.width || heightPOT !== src.height) {
      if (!(src instanceof ImageData)) {
        src = imageToImageData(src);
      }

      // Upscale to POT if the size is NPOT.
      src = scaleNPOT(src);
    }

    let gl = this.viewer.gl;

    this.webglResource = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.webglResource);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.width = src.width;
    this.height = src.height;
    this.wrapS = gl.REPEAT;
    this.wrapT = gl.REPEAT;
    this.minFilter = gl.LINEAR_MIPMAP_LINEAR;
  }
}
