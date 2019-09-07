import BinaryStream from '../../../common/binarystream';
import {scaleNPOT} from '../../../common/canvas';
import Texture from '../../texture';

/**
 * A BMP texture handler.
 */
export default class BmpTexture extends Texture {
  /**
   * @param {ArrayBuffer} src
   */
  load(src) {
    // Simple binary stream implementation, see src/common/binarystream.
    let reader = new BinaryStream(src);

    // BMP magic identifier
    if (reader.read(2) !== 'BM') {
      throw new Error('Wrong magic number');
    }

    reader.skip(8);

    let dataOffset = reader.readUint32();

    reader.skip(4);

    let width = reader.readUint32();
    let height = reader.readUint32();

    reader.skip(2);

    let bpp = reader.readUint16();

    if (bpp !== 24) {
      throw new Error('Unsupported BPP');
    }

    let compression = reader.readUint32();

    if (compression !== 0) {
      throw new Error('Unsupported compression type');
    }

    reader.seek(dataOffset);

    // Read width*height RGB pixels
    let imageData = new ImageData(width, height);
    let data = imageData.data;

    for (let i = 0, l = width * height, base = 0; i < l; i += 1, base += 4) {
      let rgb = reader.readUint8Array(3);

      data[base] = rgb[0];
      data[base + 1] = rgb[1];
      data[base + 2] = rgb[2];
      data[base + 3] = 255;
    }

    // Upscale to POT if the size is NPOT.
    imageData = scaleNPOT(imageData);

    // Finally, create the actual WebGL texture.
    let gl = this.viewer.gl;
    let id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, id);
    this.viewer.webgl.setTextureMode(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.imageData = imageData;
    this.width = imageData.width; // Note: might not be the same as 'width' and 'height' due to NPOT upscaling.
    this.height = imageData.height;
    this.webglResource = id; // If webglResource isn't set, this texture won't be bound to a texture unit
  }
}
