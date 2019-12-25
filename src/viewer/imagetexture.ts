import { powerOfTwo } from '../common/math';
import { imageToImageData, scaleNPOT } from '../common/canvas';
import { fetchDataType } from '../common/fetchdatatype';
import Texture from './texture';

/**
 * A path solver used for resolving image textures.
 */
export type ImagePathSolver = () => [string | TexImageSource];

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
  async load() {
    let finalSrc = this.pathSolver(undefined)[0];

    if (!isImageSource(finalSrc)) {
      let response = await fetchDataType(finalSrc, 'image');

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      finalSrc = response.data;
    }

    let widthPOT = powerOfTwo(finalSrc.width);
    let heightPOT = powerOfTwo(finalSrc.height);

    if (widthPOT !== finalSrc.width || heightPOT !== finalSrc.height) {
      if (!(finalSrc instanceof ImageData)) {
        finalSrc = imageToImageData(finalSrc);
      }

      // Upscale to POT if the size is NPOT.
      finalSrc = scaleNPOT(finalSrc);
    }

    let gl = this.viewer.gl;

    this.webglResource = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.webglResource);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, finalSrc);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.width = finalSrc.width;
    this.height = finalSrc.height;
    this.wrapS = gl.REPEAT;
    this.wrapT = gl.REPEAT;
    this.minFilter = gl.LINEAR_MIPMAP_LINEAR;
  }
}
