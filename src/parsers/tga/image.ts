// @ts-ignore
import TgaLoader from 'tga-js';

/**
 * A TGA image.
 */
export default class TgaImage {
  width: number = 0;
  height: number = 0;
  data: ImageData | null = null;

  load(buffer: ArrayBuffer) {
    let tga = new TgaLoader();

    tga.load(new Uint8Array(buffer));

    let header = tga.header;

    this.width = header.width;
    this.height = header.height;
    this.data = new ImageData(header.width, header.height);

    tga.getImageData(this.data);
  }
}
