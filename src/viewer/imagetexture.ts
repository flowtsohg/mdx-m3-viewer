import { powerOfTwo } from '../common/math';
import { imageToImageData, scaleNPOT } from '../common/canvas';
import { fetchDataType } from '../common/fetchdatatype';
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
  async load() {
    let finalSrc = <string | TexImageSource>this.pathSolver(undefined)[0];

    if (!isImageSource(finalSrc)) {
      let path = <string>finalSrc;
      let response = await fetchDataType(path, 'image');

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      this.extension = path.slice(path.lastIndexOf('.'));
      this.fetchUrl = path;

      finalSrc = <HTMLImageElement>response.data;
    }

    let texSource = <TexImageSource>finalSrc;

    let widthPOT = powerOfTwo(texSource.width);
    let heightPOT = powerOfTwo(texSource.height);

    if (widthPOT !== texSource.width || heightPOT !== texSource.height) {
      if (!(texSource instanceof ImageData)) {
        texSource = imageToImageData(texSource);
      }

      // Upscale to POT if the size is NPOT.
      texSource = scaleNPOT(texSource);
    }

    let gl = this.viewer.gl;

    this.webglResource = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.webglResource);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texSource);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.width = texSource.width;
    this.height = texSource.height;
    this.wrapS = gl.REPEAT;
    this.wrapT = gl.REPEAT;
    this.minFilter = gl.LINEAR_MIPMAP_LINEAR;
  }
}
