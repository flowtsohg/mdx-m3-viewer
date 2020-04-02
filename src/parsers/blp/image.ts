// @ts-ignore
import { JpegImage } from '../../../thirdparty/jpg';
import BitStream from '../../common/bitstream';
import convertBitRange from '../../common/convertbitrange';

const BLP1_MAGIC = 0x31504c42;
const CONTENT_JPG = 0x0;
// const CONTENT_PALLETE = 0x1;

/**
 * A BLP1 texture.
 */
export default class BlpImage {
  content: number = 0;
  alphaBits: number = 0;
  width: number = 0;
  height: number = 0;
  type: number = 0;
  hasMipmaps: boolean = false;
  mipmapOffsets: Uint32Array = new Uint32Array(16);
  mipmapSizes: Uint32Array = new Uint32Array(16);
  uint8array: Uint8Array | null = null;
  /**
   * Used for JPG images.
   */
  jpgHeader: Uint8Array | null = null;
  /**
   * Used for indexed images.
   */
  pallete: Uint8Array | null = null;

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
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
    this.hasMipmaps = header[6] !== 0;

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

  getMipmap(level: number) {
    let uint8array = <Uint8Array>this.uint8array;
    let offset = this.mipmapOffsets[level];
    let size = this.mipmapSizes[level];
    let imageData: ImageData;

    if (this.content === CONTENT_JPG) {
      let jpgHeader = <Uint8Array>this.jpgHeader;
      let data = new Uint8Array(jpgHeader.length + size);
      let jpegImage = new JpegImage();

      data.set(jpgHeader);
      data.set(uint8array.subarray(offset, offset + size), jpgHeader.length);

      jpegImage.parse(data);

      // The JPG data might not actually match the correct mipmap size.
      imageData = new ImageData(jpegImage.width, jpegImage.height);

      jpegImage.getData(imageData);
    } else {
      let pallete = <Uint8Array>this.pallete;
      let width = Math.max(this.width / (1 << level), 1); // max of 1 because for non-square textures one dimension will eventually be <1.
      let height = Math.max(this.height / (1 << level), 1);
      let size = width * height;
      let alphaBits = this.alphaBits;
      let bitStream;
      let bitsToByte = 0;

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
          data[dataIndex + 3] = (<BitStream>bitStream).readBits(alphaBits) * bitsToByte;
        } else {
          data[dataIndex + 3] = 255;
        }
      }
    }

    return imageData;
  }

  mipmaps() {
    if (this.hasMipmaps) {
      return Math.ceil(Math.log2(Math.max(this.width, this.height))) + 1;
    }

    return 1;
  }
}
