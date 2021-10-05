import { base256ToString } from '../../common/typecast';
import { decodeDxt1, decodeDxt3, decodeDxt5, decodeRgtc } from '../../common/dxt';
import { bytesOf } from '../../common/bytesof';

export const DDS_MAGIC = 0x20534444;
const DDSD_MIPMAPCOUNT = 0x20000;
const DDPF_FOURCC = 0x4;

export const FOURCC_DXT1 = 0x31545844;
export const FOURCC_DXT3 = 0x33545844;
export const FOURCC_DXT5 = 0x35545844;
export const FOURCC_ATI2 = 0x32495441;

const FOURCC_DX10 = 0x30315844;
const DXGI_FORMAT_BC1_UNORM = 0x00000047;
const DXGI_FORMAT_BC2_UNORM = 0x0000004A;
const DXGI_FORMAT_BC3_UNORM = 0x0000004D;
const DXGI_FORMAT_BC5_UNORM = 0x00000053;

/**
 * A DDS image.
 */
export class DdsImage {
  width = 0;
  height = 0;
  format = 0;
  mipmapWidths: number[] = [];
  mipmapHeights: number[] = [];
  mipmapDatas: Uint8Array[] = [];

  load(buffer: ArrayBuffer | Uint8Array): void {
    const bytes = bytesOf(buffer);
    const header = new Int32Array(bytes.buffer, 0, 31);
    let offset = 128; // sizeof(DDS_HEADER) + 4 for the magic.

    if (header[0] !== DDS_MAGIC) {
      throw new Error('Wrong magic number');
    }

    if (!(header[20] & DDPF_FOURCC)) {
      throw new Error('Not FourCC');
    }

    let fourCC = header[21];
    
    if (fourCC !== FOURCC_DXT1 && fourCC !== FOURCC_DXT3 && fourCC !== FOURCC_DXT5 && fourCC !== FOURCC_ATI2) {
      if (fourCC === FOURCC_DX10) {
        offset += 20; // sizeof(DDS_HEADER_DXT10)

        const extendedHeader = new Int32Array(bytes.buffer, 128, 5);
        const dxgiFormat = extendedHeader[0];

        if (dxgiFormat === DXGI_FORMAT_BC1_UNORM) {
          fourCC = FOURCC_DXT1;
        } else if (dxgiFormat === DXGI_FORMAT_BC2_UNORM) {
          fourCC = FOURCC_DXT3;
        } else if (dxgiFormat === DXGI_FORMAT_BC3_UNORM) {
          fourCC = FOURCC_DXT5;
        } else if (dxgiFormat === DXGI_FORMAT_BC5_UNORM) {
          fourCC = FOURCC_ATI2;
        } else {
          throw new Error(`Unsupported DXGI format: ${dxgiFormat}`);
        }

        console.log(extendedHeader);
      } else {
        throw new Error(`Unsupported FourCC: ${base256ToString(fourCC)}`);
      }
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

    for (let i = 0; i < mipmaps; i++) {
      const size = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockSize;

      this.mipmapWidths[i] = width;
      this.mipmapHeights[i] = height;
      this.mipmapDatas[i] = bytes.subarray(offset, offset + size);

      offset += size;
      width = Math.max(width / 2, 1);
      height = Math.max(height / 2, 1);
    }
  }

  mipmaps(): number {
    return this.mipmapDatas.length;
  }

  getMipmap(level: number, raw = false): { width: number, height: number, data: Uint8Array } {
    const width = this.mipmapWidths[level];
    const height = this.mipmapHeights[level];
    const data = this.mipmapDatas[level];
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
