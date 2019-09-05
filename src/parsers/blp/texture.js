import {JpegImage} from '../../../thirdparty/jpg';
import BitStream from '../../common/bitstream';
import convertBitRange from '../../common/convertbitrange';

let BLP1_MAGIC = 0x31504c42;
let CONTENT_JPG = 0x0;
// let CONTENT_PALLETE = 0x1;

/**
 * A BLP1 texture.
 */
export default class BlpTexture {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.content = 0;
    /** @member {number} */
    this.alphaBits = 0;
    /** @member {number} */
    this.width = 0;
    /** @member {number} */
    this.height = 0;
    /** @member {number} */
    this.type = 0;
    /** @member {Uint32Array} */
    this.hasMipmaps = false;
    /** @member {Uint32Array} */
    this.mipmapOffsets = new Uint32Array(16);
    /** @member {Uint32Array} */
    this.mipmapSizes = new Uint32Array(16);
    /** @member {?Uint8Array} */
    this.uint8array = null;
    /**
     * Used for JPG images.
     *
     * @member {?Uint8Array}
     */
    this.jpgHeader = null;
    /**
     * Used for indexed images.
     *
     * @member {?Uint8Array}
     */
    this.pallete = null;
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  load(buffer) {
    // This includes the JPG header size, in case its a JPG image.
    // Otherwise, the last element is ignored.
    let header = new Int32Array(buffer, 0, 40);

    if (header[0] !== BLP1_MAGIC) {
      throw new Error('WrongMagicNumber');
    }

    this.content = header[1];
    this.alphaBits = header[2];
    this.width = header[3];
    this.height = header[4];
    this.type = header[5];
    this.hasMipmaps = header[6];

    for (let i = 0; i < 16; i++) {
      this.mipmapOffsets[i] = header[7 + i];
      this.mipmapSizes[i] = header[23 + i];
    }

    this.uint8array = new Uint8Array(buffer);

    if (this.content === CONTENT_JPG) {
      this.jpgHeader = new Uint8Array(buffer, 160, header[39]);
    } else {
      this.pallete = new Uint8Array(buffer, 156, 1024);
    }
  }

  /**
   * @param {number} level
   * @return {ImageData}
   */
  getMipmap(level) {
    let uint8array = this.uint8array;
    let offset = this.mipmapOffsets[level];
    let size = this.mipmapSizes[level];
    let imageData;

    if (this.content === CONTENT_JPG) {
      let jpgHeader = this.jpgHeader;
      let data = new Uint8Array(jpgHeader.length + size);
      let jpegImage = new JpegImage();

      data.set(jpgHeader);
      data.set(uint8array.subarray(offset, offset + size), jpgHeader.length);

      jpegImage.parse(data);

      // The JPG data might not actually match the correct mipmap size.
      imageData = new ImageData(jpegImage.width, jpegImage.height);

      jpegImage.getData(imageData);
    } else {
      let pallete = this.pallete;
      let width = this.width / (1 << level);
      let height = this.height / (1 << level);
      let size = width * height;
      let alphaBits = this.alphaBits;
      let bitStream;
      let bitsToByte;

      imageData = new ImageData(width, height);

      if (alphaBits > 0) {
        bitStream = new BitStream(uint8array.buffer, offset + size, Math.ceil((size * alphaBits) / 8));
        bitsToByte = convertBitRange(alphaBits, 8);
      }

      let data = imageData.data;

      for (let i = 0; i < size; i++) {
        let dataIndex = i * 4;
        let paletteIndex = uint8array[offset + i] * 4;

        // BGRA->RGBA
        data[dataIndex] = pallete[paletteIndex + 2];
        data[dataIndex + 1] = pallete[paletteIndex + 1];
        data[dataIndex + 2] = pallete[paletteIndex];

        if (alphaBits > 0) {
          data[dataIndex + 3] = bitStream.readBits(alphaBits) * bitsToByte;
        } else {
          data[dataIndex + 3] = 255;
        }
      }
    }

    return imageData;
  }

  /**
   * @return {number}
   */
  mipmaps() {
    if (this.hasMipmaps) {
      return Math.log2(Math.max(this.width, this.height));
    }

    return 1;
  }
}
