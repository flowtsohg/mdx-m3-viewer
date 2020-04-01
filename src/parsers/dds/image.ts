import { base256ToString } from '../../common/typecast';
import { decodeDxt1, decodeDxt3, decodeDxt5, decodeRgtc } from '../../common/dxt';

const DDS_MAGIC = 0x20534444;
const DDSD_MIPMAPCOUNT = 0x20000;
const DDPF_FOURCC = 0x4;

export const FOURCC_DXT1 = 0x31545844;
export const FOURCC_DXT3 = 0x33545844;
export const FOURCC_DXT5 = 0x35545844;
export const FOURCC_ATI2 = 0x32495441;

/**
 * A DDS texture.
 */
export class DdsImage {
  width: number = 0;
  height: number = 0;
  format: number = 0;
  mipmapWidths: number[] = [];
  mipmapHeights: number[] = [];
  mipmapDatas: Uint8Array[] = [];

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let header = new Int32Array(buffer, 0, 31);

    if (header[0] !== DDS_MAGIC) {
      throw new Error('Wrong magic number');
    }

    if (!(header[20] & DDPF_FOURCC)) {
      throw new Error('Not FourCC');
    }

    let fourCC = header[21];

    if (fourCC !== FOURCC_DXT1 && fourCC !== FOURCC_DXT3 && fourCC !== FOURCC_DXT5 && fourCC !== FOURCC_ATI2) {
      throw new Error(`Unsupported FourCC: ${base256ToString(fourCC)}`);
    }

    this.format = fourCC;

    let mipmaps = 1;

    if (header[2] & DDSD_MIPMAPCOUNT) {
      mipmaps = Math.max(1, header[7]);
    }

    let width = header[4];
    let height = header[3];
    let blockSize = 16;

    // DXT3, DXT5, and RGTC, all have 16 bytes per block.
    if (fourCC === FOURCC_DXT1) {
      blockSize = 8;
    }

    this.width = width;
    this.height = height;

    let offset = header[1] + 4;

    for (let i = 0; i < mipmaps; i++) {
      let size = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockSize;

      this.mipmapWidths[i] = width;
      this.mipmapHeights[i] = height;
      this.mipmapDatas[i] = new Uint8Array(buffer, offset, size);

      offset += size;
      width = Math.max(width / 2, 1);
      height = Math.max(height / 2, 1);
    }
  }

  mipmaps() {
    return this.mipmapDatas.length;
  }

  getMipmap(level: number, raw: boolean = false) {
    let width = this.mipmapWidths[level];
    let height = this.mipmapHeights[level];
    let data = this.mipmapDatas[level];
    let mipmap: Uint16Array | Uint8Array;

    if (raw) {
      mipmap = data;
    } else if (this.format === FOURCC_DXT1) {
      mipmap = decodeDxt1(data, width, height);
    } else if (this.format === FOURCC_DXT3) {
      mipmap = decodeDxt3(data, width, height);
    } else if (this.format === FOURCC_DXT5) {
      mipmap = decodeDxt5(data, width, height);
    } else {
      mipmap = decodeRgtc(data, width, height);
    }

    return { width, height, data: mipmap };
  }
}
