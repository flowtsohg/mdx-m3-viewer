import { isPowerOfTwo } from '../common/math';
import { isGif, isJpeg, isPng, isWebP } from '../common/isformat';
import Texture from './texture';
import { HandlerResourceData } from './handlerresource';

/**
 * Checks if the given source is a supported image texture source.
 */
export function isImageSource(src: any) {
  return src instanceof ImageData || src instanceof HTMLImageElement || src instanceof HTMLCanvasElement || src instanceof HTMLVideoElement;
}

/**
 * Detects whether the given buffer is a supported format, and if so returns the mime.
 * The supported formats are PNG, JPEG, GIF, and WebP.
 */
export function detectMime(buffer: Uint8Array) {
  if (isPng(buffer)) {
    return 'image/png';
  }

  if (isJpeg(buffer)) {
    return 'image/jpeg';
  }

  if (isGif(buffer)) {
    return 'image/gif';
  }

  if (isWebP(buffer)) {
    return 'image/webp';
  }

  return '';
}

/**
 * A texture handler for image sources.
 */
export class ImageTexture extends Texture {
  constructor(src: TexImageSource, resourceData: HandlerResourceData) {
    super(resourceData);

    let gl = this.viewer.gl;

    this.webglResource = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.webglResource);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    if (isPowerOfTwo(src.width) && isPowerOfTwo(src.height)) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      // Required for NPOT textures.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    this.width = src.width;
    this.height = src.height;
  }
}
