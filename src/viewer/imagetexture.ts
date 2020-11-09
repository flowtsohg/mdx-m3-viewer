import { powerOfTwo } from '../common/math';
import { imageToImageData, scaleNPOT } from '../common/canvas';
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
export function detectMime(buffer: ArrayBuffer) {
  let bytes = new Uint8Array(buffer);
  let l = bytes.length;
  let mime = '';

  // PNG starts with [89 50 4E 47 0D 0A 1A 0A]
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) {
    return 'image/png'
  }

  // JPG starts with [FF D8] and ends with [FF D9].
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[l - 2] === 0xff && bytes[l - 1] === 0xd9) {
    return 'image/jpeg';
  }

  // GIF starts with [47 49 46 38 37 61] or [47 49 46 38 39 61].
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61) {
    return 'image/gif';
  }

  // WebP starts with [52 49 46 46] followed by the file size - 8 followed by [57 45 42 50].
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return 'image/webp'
  }

  return mime;
}

/**
 * A texture handler for image sources.
 */
export class ImageTexture extends Texture {
  constructor(src: TexImageSource, resourceData: HandlerResourceData) {
    super(resourceData);

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
