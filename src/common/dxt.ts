import convertBitRange from './convertbitrange';

const dxt4to8 = convertBitRange(4, 8);
const dxt5to8 = convertBitRange(5, 8);
const dxt6to8 = convertBitRange(6, 8);
const dx1colors = new Uint16Array(4);
const dx3colors = new Uint8Array(12);
const dx5alphas = new Uint8Array(8);
const red = new Uint8Array(8);
const green = new Uint8Array(8);

function dx1Colors16(out: Uint16Array, color0: number, color1: number) {
  let r0 = color0 & 0x1f;
  let g0 = color0 & 0x7e0;
  let b0 = color0 & 0xf800;
  let r1 = color1 & 0x1f;
  let g1 = color1 & 0x7e0;
  let b1 = color1 & 0xf800;

  // Minimum and maximum colors.
  out[0] = color0;
  out[1] = color1;

  // Interpolated colors.
  out[2] = ((5 * r0 + 3 * r1) >> 3) | (((5 * g0 + 3 * g1) >> 3) & 0x7e0) | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
  out[3] = ((5 * r1 + 3 * r0) >> 3) | (((5 * g1 + 3 * g0) >> 3) & 0x7e0) | (((5 * b1 + 3 * b0) >> 3) & 0xf800);
}

function dx1Colors8(out: Uint8Array, color0: number, color1: number) {
  let r0 = ((color0 >> 11) & 31) * dxt5to8;
  let g0 = ((color0 >> 5) & 63) * dxt6to8;
  let b0 = (color0 & 31) * dxt5to8;
  let r1 = ((color1 >> 11) & 31) * dxt5to8;
  let g1 = ((color1 >> 5) & 63) * dxt6to8;
  let b1 = (color1 & 31) * dxt5to8;

  // Minimum and maximum colors.
  out[0] = r0;
  out[1] = g0;
  out[2] = b0;
  out[3] = r1;
  out[4] = g1;
  out[5] = b1;

  // Interpolated colors.
  out[6] = (5 * r0 + 3 * r1) >> 3;
  out[7] = (5 * g0 + 3 * g1) >> 3;
  out[8] = (5 * b0 + 3 * b1) >> 3;
  out[9] = (5 * r1 + 3 * r0) >> 3;
  out[10] = (5 * g1 + 3 * g0) >> 3;
  out[11] = (5 * b1 + 3 * b0) >> 3;
}

function dx5Alphas(out: Uint8Array, alpha0: number, alpha1: number) {
  // Minimum and maximum alphas.
  out[0] = alpha0;
  out[1] = alpha1;

  // Interpolated alphas.
  if (alpha0 > alpha1) {
    out[2] = (54 * alpha0 + 9 * alpha1) >> 6;
    out[3] = (45 * alpha0 + 18 * alpha1) >> 6;
    out[4] = (36 * alpha0 + 27 * alpha1) >> 6;
    out[5] = (27 * alpha0 + 36 * alpha1) >> 6;
    out[6] = (18 * alpha0 + 45 * alpha1) >> 6;
    out[7] = (9 * alpha0 + 54 * alpha1) >> 6;
  } else {
    out[2] = (12 * alpha0 + 3 * alpha1) >> 4;
    out[3] = (9 * alpha0 + 6 * alpha1) >> 4;
    out[4] = (6 * alpha0 + 9 * alpha1) >> 4;
    out[5] = (3 * alpha0 + 12 * alpha1) >> 4;
    out[6] = 0;
    out[7] = 255;
  }
}

function rgColors(out: Uint8Array, color0: number, color1: number) {
  // Minimum and maximum red colors.
  out[0] = color0;
  out[1] = color1;

  // Interpolated red colors.
  if (color0 > color1) {
    out[2] = (6 * color0 + 1 * color1) / 7;
    out[3] = (5 * color0 + 2 * color1) / 7;
    out[4] = (4 * color0 + 3 * color1) / 7;
    out[5] = (3 * color0 + 4 * color1) / 7;
    out[6] = (2 * color0 + 5 * color1) / 7;
    out[7] = (1 * color0 + 6 * color1) / 7;
  } else {
    out[2] = (4 * color0 + 1 * color1) / 5;
    out[3] = (3 * color0 + 2 * color1) / 5;
    out[4] = (2 * color0 + 3 * color1) / 5;
    out[5] = (1 * color0 + 4 * color1) / 5;
    out[6] = 0;
    out[7] = 1;
  }
}

/**
 * Decodes DXT1 data to a Uint16Array typed array with 5-6-5 RGB bits.
 * 
 * DXT1 is also known as BC1.
 */
export function decodeDxt1(src: Uint8Array, width: number, height: number) {
  let dst = new Uint16Array(width * height);

  for (let blockY = 0, blockHeight = height / 4; blockY < blockHeight; blockY++) {
    for (let blockX = 0, blockWidth = width / 4; blockX < blockWidth; blockX++) {
      let i = 8 * (blockY * blockWidth + blockX);

      // Get the color values.
      dx1Colors16(dx1colors, src[i] + 256 * src[i + 1], src[i + 2] + 256 * src[i + 3]);

      // The offset to the first pixel in the destination.
      let dstI = (blockY * 4) * width + blockX * 4;

      // All 32 color bits.
      let bits = src[i + 4] | (src[i + 5] << 8) | (src[i + 6] << 16) | (src[i + 7] << 24);

      for (let row = 0; row < 4; row++) {
        let rowOffset = row * 8;
        let dstOffset = dstI + row * width;

        for (let column = 0; column < 4; column++) {
          dst[dstOffset + column] = dx1colors[(bits >> (rowOffset + column * 2)) & 3];
        }
      }
    }
  }

  return dst;
}

/**
 * Decodes DXT3 data to a Uint8Array typed array with 8-8-8-8 RGBA bits.
 * 
 * DXT3 is also known as BC2.
 */
export function decodeDxt3(src: Uint8Array, width: number, height: number) {
  let dst = new Uint8Array(width * height * 4);
  let rowBytes = width * 4;

  for (let blockY = 0, blockHeight = width / 4; blockY < blockHeight; blockY++) {
    for (let blockX = 0, blockWidth = height / 4; blockX < blockWidth; blockX++) {
      let i = 16 * (blockY * blockWidth + blockX);

      // Get the color values.
      dx1Colors8(dx3colors, src[i + 8] + 256 * src[i + 9], src[i + 10] + 256 * src[i + 11]);

      let dstI = (blockY * 16) * width + blockX * 16;

      for (let row = 0; row < 4; row++) {
        // Get 16 bits of alpha indices.
        let alphaBits = src[i + row * 2] + 256 * src[i + 1 + row * 2];

        // Get 8 bits of color indices.
        let colorBits = src[i + 12 + row];

        for (let column = 0; column < 4; column++) {
          let dstIndex = dstI + column * 4;
          let colorIndex = ((colorBits >> (column * 2)) & 3) * 3;

          dst[dstIndex + 0] = dx3colors[colorIndex + 0];
          dst[dstIndex + 1] = dx3colors[colorIndex + 1];
          dst[dstIndex + 2] = dx3colors[colorIndex + 2];
          dst[dstIndex + 3] = ((alphaBits >> (column * 4)) & 0xf) * dxt4to8;
        }

        dstI += rowBytes;
      }
    }
  }

  return dst;
}

/**
 * Decodes DXT5 data to a Uint8Array typed array with 8-8-8-8 RGBA bits.
 * 
 * DXT5 is also known as BC3.
 */
export function decodeDxt5(src: Uint8Array, width: number, height: number) {
  let dst = new Uint8Array(width * height * 4);
  let rowBytes = width * 4;

  for (let blockY = 0, blockHeight = height / 4; blockY < blockHeight; blockY++) {
    for (let blockX = 0, blockWidth = width / 4; blockX < blockWidth; blockX++) {
      let i = 16 * (blockY * blockWidth + blockX);

      // Get the alpha values.
      dx5Alphas(dx5alphas, src[i], src[i + 1]);

      // Get the color values.
      dx1Colors8(dx3colors, src[i + 8] + 256 * src[i + 9], src[i + 10] + 256 * src[i + 11]);

      // The offset to the first pixel in the destination.
      let dstI = (blockY * 16) * width + blockX * 16;

      // The outer loop is only needed because JS bitwise operators only work on 32bit integers, while the alpha flags contain 48 bits.
      // Processing is instead done in two blocks, where each one handles 24 bits, or two rows of 4 pixels.
      for (let block = 0; block < 2; block++) {
        let alphaOffset = i + 2 + block * 3;
        let colorOffset = i + 12 + block * 2;

        // 24 alpha bits.
        let alphaBits = src[alphaOffset] + 256 * (src[alphaOffset + 1] + 256 * src[alphaOffset + 2]);

        // Go over two rows.
        for (let row = 0; row < 2; row++) {
          let colorBits = src[colorOffset + row];

          // Go over four columns.
          for (let column = 0; column < 4; column++) {
            let dstIndex = dstI + column * 4;
            let colorIndex = ((colorBits >> (column * 2)) & 3) * 3;
            let alphaIndex = (alphaBits >> (row * 12 + column * 3)) & 7;

            // Set the pixel.
            dst[dstIndex + 0] = dx3colors[colorIndex + 0];
            dst[dstIndex + 1] = dx3colors[colorIndex + 1];
            dst[dstIndex + 2] = dx3colors[colorIndex + 2];
            dst[dstIndex + 3] = dx5alphas[alphaIndex];
          }

          // Next row.
          dstI += rowBytes;
        }
      }
    }
  }

  return dst;
}

/**
 * Decodes RGTC data to a Uint8Array typed array with 8-8 RG bits.
 * 
 * RGTC is also known as BC5, ATI2, and 3Dc.
 */
export function decodeRgtc(src: Uint8Array, width: number, height: number) {
  let dst = new Uint8Array(width * height * 2);
  let rowBytes = width * 2;

  for (let blockY = 0, blockHeight = height / 4; blockY < blockHeight; blockY++) {
    for (let blockX = 0, blockWidth = width / 4; blockX < blockWidth; blockX++) {
      let i = 16 * (blockY * blockWidth + blockX);

      // Get the red colors.
      rgColors(red, src[i], src[i + 1]);

      // Get the green colors.
      rgColors(green, src[i + 8], src[i + 9]);

      // The offset to the first pixel in the destination.
      let dstI = (blockY * 8) * width + blockX * 8;

      // Split to two blocks of two rows, because there are 48 color bits.
      for (let block = 0; block < 2; block++) {
        let blockOffset = i + block * 3;

        // Get 24 bits of the color indices.
        let redbits = src[blockOffset + 2] + 256 * (src[blockOffset + 3] + 256 * src[blockOffset + 4]);
        let greenbits = src[blockOffset + 10] + 256 * (src[blockOffset + 11] + 256 * src[blockOffset + 12]);

        for (let row = 0; row < 2; row++) {
          let rowOffset = row * 4;

          for (let column = 0; column < 4; column++) {
            let dstOffset = dstI + column * 2;
            let shifts = 3 * (rowOffset + column);

            dst[dstOffset + 1] = red[(redbits >> shifts) & 7];
            dst[dstOffset + 2] = green[(greenbits >> shifts) & 7];
          }

          // Next row.
          dstI += rowBytes;
        }
      }
    }
  }

  return dst;
}
