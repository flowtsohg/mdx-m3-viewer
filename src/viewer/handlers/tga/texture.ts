import { isPowerOfTwo } from '../../../common/math';
import TgaImage from '../../../parsers/tga/image';
import { HandlerResourceData } from '../../handlerresource';
import Texture from '../../texture';

/**
 * A TGA texture handler.
 */
export default class TgaTexture extends Texture {
  constructor(bufferOrImage: ArrayBuffer | TgaImage, resourceData: HandlerResourceData) {
    super(resourceData);

    let image;

    if (bufferOrImage instanceof TgaImage) {
      image = bufferOrImage;
    } else {
      image = new TgaImage();

      image.load(bufferOrImage);
    }

    let width = image.width;
    let height = image.height;

    let gl = this.viewer.gl;
    let id = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, id);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, <ImageData>image.data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    if (isPowerOfTwo(width) && isPowerOfTwo(height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    this.webglResource = id;
    this.width = width;
    this.height = height;
  }
}
