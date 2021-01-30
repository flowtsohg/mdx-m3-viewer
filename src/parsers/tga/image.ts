// @ts-ignore
import TgaLoader from 'tga-js';
import { bytesOf } from '../../common/typecast';

/**
 * A TGA image.
 */
export default class TgaImage {
  width: number = 0;
  height: number = 0;
  data: ImageData | null = null;

  load(buffer: ArrayBuffer | Uint8Array) {
    let bytes = bytesOf(buffer);
    let tga = new TgaLoader();

    tga.load(bytes);

    let header = tga.header;

    this.width = header.width;
    this.height = header.height;
    this.data = new ImageData(header.width, header.height);

    tga.getImageData(this.data);
  }
}
