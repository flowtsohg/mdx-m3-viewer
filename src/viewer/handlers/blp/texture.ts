import { isPowerOfTwo } from '../../../common/math';
import { BlpImage } from '../../../parsers/blp/image';
import { HandlerResourceData } from '../../handlerresource';
import Texture from '../../texture';

/**
 * A BLP texure handler.
 */
export default class BlpTexture extends Texture {
  constructor(bufferOrImage: ArrayBuffer | BlpImage, resourceData: HandlerResourceData) {
    super(resourceData);

    let image;

    if (bufferOrImage instanceof BlpImage) {
      image = bufferOrImage;
    } else {
      image = new BlpImage();

      image.load(bufferOrImage);
    }

    let viewer = this.viewer;
    let gl = viewer.gl;

    let id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, id);

    let imageData = image.getMipmap(0);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    if (isPowerOfTwo(imageData.width) && isPowerOfTwo(imageData.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    /// TODO: What to do with fake mipmaps?
    // let mipmaps = image.mipmaps();

    // viewer.webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, mipmaps > 1 ? gl.LINEAR : gl.LINEAR);

    // for (let i = 0; i < mipmaps; i++) {
    //   let imageData = image.getMipmap(i);

    //   if (i === 0) {
    //     this.imageData = imageData;
    //     this.width = imageData.width; // Note: might not be the same as 'width' and 'height' due to NPOT upscaling.
    //     this.height = imageData.height;
    //   }

    //   gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    // }

    this.webglResource = id;
    this.width = imageData.width;
    this.height = imageData.height;
  }
}
