import TgaLoader from 'tga-js';
import { bytesOf } from '../../common/bytesof';

/**
 * A TGA image.
 */
export default class TgaImage {
  width = 0;
  height = 0;
  data: ImageData | null = null;

  load(buffer: ArrayBuffer | Uint8Array): void {
    const bytes = bytesOf(buffer);
    const tga = new TgaLoader();

    tga.load(bytes);

    const header = tga.header;

    this.width = header.width;
    this.height = header.height;
    this.data = new ImageData(header.width, header.height);

    tga.getImageData(this.data);
  }
}
