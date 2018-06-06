// Note: This file is largely based on https://github.com/toji/webctx-texture-utils/blob/master/texture-util/dds.js
import convertBitRange from './convertbitrange';

let dxt4to8 = convertBitRange(4, 8);
let dxt5to8 = convertBitRange(5, 8);
let dxt6to8 = convertBitRange(6, 8);

/**
 * 4 bit alpha
 *
 * @param {Uint8Array} dst
 * @param {number} i
 * @param {number} int565
 * @param {number} a
 */
function setRgba8888Dxt3(dst, i, int565, a) {
  dst[i] = (((int565 >> 11) & 31) * dxt5to8) | 0;
  dst[i + 1] = (((int565 >> 5) & 63) * dxt6to8) | 0;
  dst[i + 2] = ((int565 & 31) * dxt5to8) | 0;
  dst[i + 3] = a * dxt4to8;
}

/**
 * 8 bit alpha
 *
 * @param {Uint8Array} dst
 * @param {number} i
 * @param {number} int565
 * @param {number} a
 */
function setRgba8888Dxt5(dst, i, int565, a) {
  dst[i] = (((int565 >> 11) & 31) * dxt5to8) | 0;
  dst[i + 1] = (((int565 >> 5) & 63) * dxt6to8) | 0;
  dst[i + 2] = ((int565 & 31) * dxt5to8) | 0;
  dst[i + 3] = a;
}

/**
 * Decodes DXT1 data to a Uint16Array typed array with 5-6-5 RGB bits.
 *
 * @param {Uint16Array} src The DXT1 data.
 * @param {number} width The width of the data.
 * @param {number} height The height of the data.
 * @return {Uint16Array}
 */
export function decodeDxt1(src, width, height) {
  let c = new Uint16Array(4);
  let dst = new Uint16Array(width * height);

  for (let blockY = 0, blockHeight = height / 4; blockY < blockHeight; blockY++) {
    for (let blockX = 0, blockWidth = width / 4; blockX < blockWidth; blockX++) {
      let i = 4 * (blockY * blockWidth + blockX);

      c[0] = src[i];
      c[1] = src[i + 1];

      let r0 = c[0] & 0x1f;
      let g0 = c[0] & 0x7e0;
      let b0 = c[0] & 0xf800;
      let r1 = c[1] & 0x1f;
      let g1 = c[1] & 0x7e0;
      let b1 = c[1] & 0xf800;

      if (c[0] > c[1]) {
        c[2] = ((5 * r0 + 3 * r1) >> 3) | (((5 * g0 + 3 * g1) >> 3) & 0x7e0) | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
        c[3] = ((5 * r1 + 3 * r0) >> 3) | (((5 * g1 + 3 * g0) >> 3) & 0x7e0) | (((5 * b1 + 3 * b0) >> 3) & 0xf800);
      } else {
        c[2] = (c[0] + c[1]) >> 1;
        c[3] = 0;
      }

      let m = src[i + 2];
      let dstI = (blockY * 4) * width + blockX * 4;
      dst[dstI] = c[m & 0x3];
      dst[dstI + 1] = c[(m >> 2) & 0x3];
      dst[dstI + 2] = c[(m >> 4) & 0x3];
      dst[dstI + 3] = c[(m >> 6) & 0x3];
      dstI += width;
      dst[dstI] = c[(m >> 8) & 0x3];
      dst[dstI + 1] = c[(m >> 10) & 0x3];
      dst[dstI + 2] = c[(m >> 12) & 0x3];
      dst[dstI + 3] = c[(m >> 14)];
      m = src[i + 3];
      dstI += width;
      dst[dstI] = c[m & 0x3];
      dst[dstI + 1] = c[(m >> 2) & 0x3];
      dst[dstI + 2] = c[(m >> 4) & 0x3];
      dst[dstI + 3] = c[(m >> 6) & 0x3];
      dstI += width;
      dst[dstI] = c[(m >> 8) & 0x3];
      dst[dstI + 1] = c[(m >> 10) & 0x3];
      dst[dstI + 2] = c[(m >> 12) & 0x3];
      dst[dstI + 3] = c[(m >> 14)];
    }
  }

  return dst;
}

/**
 * Decodes DXT3 data to a Uint8Array typed array with 8-8-8-8 RGBA bits.
 *
 * @param {Uint16Array} src The DXT3 data.
 * @param {number} width The width of the data.
 * @param {number} height The height of the data.
 * @return {Uint8Array}
 */
export function decodeDxt3(src, width, height) {
  let c = new Uint16Array(4);
  let dst = new Uint8Array(width * height * 4);
  let widthBytes = width * 4;

  for (let blockY = 0, blockHeight = width / 4; blockY < blockHeight; blockY++) {
    for (let blockX = 0, blockWidth = height / 4; blockX < blockWidth; blockX++) {
      let i = 8 * (blockY * blockWidth + blockX);

      c[0] = src[i + 4];
      c[1] = src[i + 5];

      let r0 = c[0] & 0x1f;
      let g0 = c[0] & 0x7e0;
      let b0 = c[0] & 0xf800;
      let r1 = c[1] & 0x1f;
      let g1 = c[1] & 0x7e0;
      let b1 = c[1] & 0xf800;

      c[2] = ((5 * r0 + 3 * r1) >> 3) | (((5 * g0 + 3 * g1) >> 3) & 0x7e0) | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
      c[3] = ((5 * r1 + 3 * r0) >> 3) | (((5 * g1 + 3 * g0) >> 3) & 0x7e0) | (((5 * b1 + 3 * b0) >> 3) & 0xf800);

      let m = src[i + 6];
      let a = src[i];
      let dstI = (blockY * 16) * width + blockX * 16;
      setRgba8888Dxt3(dst, dstI, c[m & 0x3], a & 0xf);
      setRgba8888Dxt3(dst, dstI + 4, c[(m >> 2) & 0x3], (a >> 4) & 0xf);
      setRgba8888Dxt3(dst, dstI + 8, c[(m >> 4) & 0x3], (a >> 8) & 0xf);
      setRgba8888Dxt3(dst, dstI + 12, c[(m >> 6) & 0x3], (a >> 12) & 0xf);
      a = src[i + 1];
      dstI += widthBytes;
      setRgba8888Dxt3(dst, dstI, c[(m >> 8) & 0x3], a & 0xf);
      setRgba8888Dxt3(dst, dstI + 4, c[(m >> 10) & 0x3], (a >> 4) & 0xf);
      setRgba8888Dxt3(dst, dstI + 8, c[(m >> 12) & 0x3], (a >> 8) & 0xf);
      setRgba8888Dxt3(dst, dstI + 12, c[m >> 14], (a >> 12) & 0xf);
      m = src[i + 7];
      a = src[i + 2];
      dstI += widthBytes;
      setRgba8888Dxt3(dst, dstI, c[m & 0x3], a & 0xf);
      setRgba8888Dxt3(dst, dstI + 4, c[(m >> 2) & 0x3], (a >> 4) & 0xf);
      setRgba8888Dxt3(dst, dstI + 8, c[(m >> 4) & 0x3], (a >> 8) & 0xf);
      setRgba8888Dxt3(dst, dstI + 12, c[(m >> 6) & 0x3], (a >> 12) & 0xf);
      a = src[i + 3];
      dstI += widthBytes;
      setRgba8888Dxt3(dst, dstI, c[(m >> 8) & 0x3], a & 0xf);
      setRgba8888Dxt3(dst, dstI + 4, c[(m >> 10) & 0x3], (a >> 4) & 0xf);
      setRgba8888Dxt3(dst, dstI + 8, c[(m >> 12) & 0x3], (a >> 8) & 0xf);
      setRgba8888Dxt3(dst, dstI + 12, c[m >> 14], (a >> 12) & 0xf);
    }
  }

  return dst;
}

/**
 * Decodes DXT5 data to a Uint8Array typed array with 8-8-8-8 RGBA bits.
 *
 * @param {Uint16Array} src The DXT5 data.
 * @param {number} width The width of the data.
 * @param {number} height The height of the data.
 * @return {Uint8Array}
 */
export function decodeDxt5(src, width, height) {
  let c = new Uint16Array(4);
  let a = new Uint8Array(8);
  let dst = new Uint8Array(width * height * 4);
  let widthBytes = width * 4;

  for (let blockY = 0, blockHeight = height / 4; blockY < blockHeight; blockY++) {
    for (let blockX = 0, blockWidth = width / 4; blockX < blockWidth; blockX++) {
      let i = 8 * (blockY * blockWidth + blockX);

      c[0] = src[i + 4];
      c[1] = src[i + 5];

      let r0 = c[0] & 0x1f;
      let g0 = c[0] & 0x7e0;
      let b0 = c[0] & 0xf800;
      let r1 = c[1] & 0x1f;
      let g1 = c[1] & 0x7e0;
      let b1 = c[1] & 0xf800;

      c[2] = ((5 * r0 + 3 * r1) >> 3) | (((5 * g0 + 3 * g1) >> 3) & 0x7e0) | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
      c[3] = ((5 * r1 + 3 * r0) >> 3) | (((5 * g1 + 3 * g0) >> 3) & 0x7e0) | (((5 * b1 + 3 * b0) >> 3) & 0xf800);

      let alphaBits = src[i + 1] + 65536 * (src[i + 2] + 65536 * src[i + 3]);

      a[0] = src[i] & 0xff;
      a[1] = src[i] >> 8;

      if (a[0] > a[1]) {
        a[2] = (54 * a[0] + 9 * a[1]) >> 6;
        a[3] = (45 * a[0] + 18 * a[1]) >> 6;
        a[4] = (36 * a[0] + 27 * a[1]) >> 6;
        a[5] = (27 * a[0] + 36 * a[1]) >> 6;
        a[6] = (18 * a[0] + 45 * a[1]) >> 6;
        a[7] = (9 * a[0] + 54 * a[1]) >> 6;

        /*
        a[2] = (6 * a[0] + a[1]) / 7;
        a[3] = (5 * a[0] + 2 * a[1]) / 7;
        a[4] = (4 * a[0] + 3 * a[1]) / 7;
        a[5] = (3 * a[0] + 4 * a[1]) / 7;
        a[6] = (2 * a[0] + 5 * a[1]) / 7;
        a[7] = (a[0] + 6 * a[1]) / 7;
        //*/
      } else {
        a[2] = (12 * a[0] + 3 * a[1]) >> 4;
        a[3] = (9 * a[0] + 6 * a[1]) >> 4;
        a[4] = (6 * a[0] + 9 * a[1]) >> 4;
        a[5] = (3 * a[0] + 12 * a[1]) >> 4;
        a[6] = 0;
        a[7] = 1;

        /*
        a[2] = (4 * a[0] + a[1]) / 5;
        a[3] = (3 * a[0] + 2 * a[1]) / 5;
        a[4] = (2 * a[0] + 3 * a[1]) / 5;
        a[5] = (a[0] + 4 * a[1]) / 5;
        a[6] = 0;
        a[7] = 1;
        //*/
      }

      let m = src[i + 6];
      let dstI = (blockY * 16) * width + blockX * 16;
      setRgba8888Dxt5(dst, dstI, c[m & 0x3], a[alphaBits & 0x7]);
      setRgba8888Dxt5(dst, dstI + 4, c[(m >> 2) & 0x3], a[(alphaBits >> 3) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 8, c[(m >> 4) & 0x3], a[(alphaBits >> 6) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 12, c[(m >> 6) & 0x3], a[(alphaBits >> 9) & 0x7]);
      dstI += widthBytes;
      setRgba8888Dxt5(dst, dstI, c[(m >> 8) & 0x3], a[(alphaBits >> 12) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 4, c[(m >> 10) & 0x3], a[(alphaBits >> 15) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 8, c[(m >> 12) & 0x3], a[(alphaBits >> 18) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 12, c[m >> 14], a[(alphaBits >> 21) & 0x7]);
      m = src[i + 7];
      dstI += widthBytes;
      setRgba8888Dxt5(dst, dstI, c[m & 0x3], a[(alphaBits >> 24) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 4, c[(m >> 2) & 0x3], a[(alphaBits >> 27) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 8, c[(m >> 4) & 0x3], a[(alphaBits >> 30) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 12, c[(m >> 6) & 0x3], a[(alphaBits >> 33) & 0x7]);
      dstI += widthBytes;
      setRgba8888Dxt5(dst, dstI, c[(m >> 8) & 0x3], a[(alphaBits >> 36) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 4, c[(m >> 10) & 0x3], a[(alphaBits >> 39) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 8, c[(m >> 12) & 0x3], a[(alphaBits >> 42) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 12, c[m >> 14], a[(alphaBits >> 45) & 0x7]);
    }
  }

  return dst;
}
