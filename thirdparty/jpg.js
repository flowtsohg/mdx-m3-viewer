/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// NOTICE: This file was edited to support loading JPEG data stored in BLP files, which use a non-standard RGBA pixel format.

'use strict';


let _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
};


let JpegError = function JpegErrorClosure() {
  function JpegError(msg) {
    this.message = 'JPEG error: ' + msg;
  }
  JpegError.prototype = new Error();
  JpegError.prototype.name = 'JpegError';
  JpegError.constructor = JpegError;
  return JpegError;
}();
let JpegImage = function JpegImageClosure() {
  let dctZigZag = new Uint8Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
  let dctCos1 = 4017;
  let dctSin1 = 799;
  let dctCos3 = 3406;
  let dctSin3 = 2276;
  let dctCos6 = 1567;
  let dctSin6 = 3784;
  let dctSqrt2 = 5793;
  let dctSqrt1d2 = 2896;
  function JpegImage() {
    this.decodeTransform = null;
    this.colorTransform = -1;
  }
  function buildHuffmanTable(codeLengths, values) {
    let k = 0,
      code = [],
      i,
      j,
      length = 16;
    while (length > 0 && !codeLengths[length - 1]) {
      length--;
    }
    code.push({
      children: [],
      index: 0,
    });
    let p = code[0],
      q;
    for (i = 0; i < length; i++) {
      for (j = 0; j < codeLengths[i]; j++) {
        p = code.pop();
        p.children[p.index] = values[k];
        while (p.index > 0) {
          p = code.pop();
        }
        p.index++;
        code.push(p);
        while (code.length <= i) {
          code.push(q = {
            children: [],
            index: 0,
          });
          p.children[p.index] = q.children;
          p = q;
        }
        k++;
      }
      if (i + 1 < length) {
        code.push(q = {
          children: [],
          index: 0,
        });
        p.children[p.index] = q.children;
        p = q;
      }
    }
    return code[0].children;
  }
  function getBlockBufferOffset(component, row, col) {
    return 64 * ((component.blocksPerLine + 1) * row + col);
  }
  function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive) {
    let mcusPerLine = frame.mcusPerLine;
    let progressive = frame.progressive;
    let startOffset = offset,
      bitsData = 0,
      bitsCount = 0;
    function readBit() {
      if (bitsCount > 0) {
        bitsCount--;
        return bitsData >> bitsCount & 1;
      }
      bitsData = data[offset++];
      if (bitsData === 0xFF) {
        let nextByte = data[offset++];
        if (nextByte) {
          throw new JpegError('unexpected marker ' + (bitsData << 8 | nextByte).toString(16));
        }
      }
      bitsCount = 7;
      return bitsData >>> 7;
    }
    function decodeHuffman(tree) {
      let node = tree;
      while (true) {
        node = node[readBit()];
        if (typeof node === 'number') {
          return node;
        }
        if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object') {
          throw new JpegError('invalid huffman sequence');
        }
      }
    }
    function receive(length) {
      let n = 0;
      while (length > 0) {
        n = n << 1 | readBit();
        length--;
      }
      return n;
    }
    function receiveAndExtend(length) {
      if (length === 1) {
        return readBit() === 1 ? 1 : -1;
      }
      let n = receive(length);
      if (n >= 1 << length - 1) {
        return n;
      }
      return n + (-1 << length) + 1;
    }
    function decodeBaseline(component, offset) {
      let t = decodeHuffman(component.huffmanTableDC);
      let diff = t === 0 ? 0 : receiveAndExtend(t);
      component.blockData[offset] = component.pred += diff;
      let k = 1;
      while (k < 64) {
        let rs = decodeHuffman(component.huffmanTableAC);
        let s = rs & 15,
          r = rs >> 4;
        if (s === 0) {
          if (r < 15) {
            break;
          }
          k += 16;
          continue;
        }
        k += r;
        let z = dctZigZag[k];
        component.blockData[offset + z] = receiveAndExtend(s);
        k++;
      }
    }
    function decodeDCFirst(component, offset) {
      let t = decodeHuffman(component.huffmanTableDC);
      let diff = t === 0 ? 0 : receiveAndExtend(t) << successive;
      component.blockData[offset] = component.pred += diff;
    }
    function decodeDCSuccessive(component, offset) {
      component.blockData[offset] |= readBit() << successive;
    }
    let eobrun = 0;
    function decodeACFirst(component, offset) {
      if (eobrun > 0) {
        eobrun--;
        return;
      }
      let k = spectralStart,
        e = spectralEnd;
      while (k <= e) {
        let rs = decodeHuffman(component.huffmanTableAC);
        let s = rs & 15,
          r = rs >> 4;
        if (s === 0) {
          if (r < 15) {
            eobrun = receive(r) + (1 << r) - 1;
            break;
          }
          k += 16;
          continue;
        }
        k += r;
        let z = dctZigZag[k];
        component.blockData[offset + z] = receiveAndExtend(s) * (1 << successive);
        k++;
      }
    }
    let successiveACState = 0,
      successiveACNextValue;
    function decodeACSuccessive(component, offset) {
      let k = spectralStart;
      let e = spectralEnd;
      let r = 0;
      let s;
      let rs;
      while (k <= e) {
        let z = dctZigZag[k];
        switch (successiveACState) {
          case 0:
            rs = decodeHuffman(component.huffmanTableAC);
            s = rs & 15;
            r = rs >> 4;
            if (s === 0) {
              if (r < 15) {
                eobrun = receive(r) + (1 << r);
                successiveACState = 4;
              } else {
                r = 16;
                successiveACState = 1;
              }
            } else {
              if (s !== 1) {
                throw new JpegError('invalid ACn encoding');
              }
              successiveACNextValue = receiveAndExtend(s);
              successiveACState = r ? 2 : 3;
            }
            continue;
          case 1:
          case 2:
            if (component.blockData[offset + z]) {
              component.blockData[offset + z] += readBit() << successive;
            } else {
              r--;
              if (r === 0) {
                successiveACState = successiveACState === 2 ? 3 : 0;
              }
            }
            break;
          case 3:
            if (component.blockData[offset + z]) {
              component.blockData[offset + z] += readBit() << successive;
            } else {
              component.blockData[offset + z] = successiveACNextValue << successive;
              successiveACState = 0;
            }
            break;
          case 4:
            if (component.blockData[offset + z]) {
              component.blockData[offset + z] += readBit() << successive;
            }
            break;
        }
        k++;
      }
      if (successiveACState === 4) {
        eobrun--;
        if (eobrun === 0) {
          successiveACState = 0;
        }
      }
    }
    function decodeMcu(component, decode, mcu, row, col) {
      let mcuRow = mcu / mcusPerLine | 0;
      let mcuCol = mcu % mcusPerLine;
      let blockRow = mcuRow * component.v + row;
      let blockCol = mcuCol * component.h + col;
      let offset = getBlockBufferOffset(component, blockRow, blockCol);
      decode(component, offset);
    }
    function decodeBlock(component, decode, mcu) {
      let blockRow = mcu / component.blocksPerLine | 0;
      let blockCol = mcu % component.blocksPerLine;
      let offset = getBlockBufferOffset(component, blockRow, blockCol);
      decode(component, offset);
    }
    let componentsLength = components.length;
    let component, i, j, k, n;
    let decodeFn;
    if (progressive) {
      if (spectralStart === 0) {
        decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
      } else {
        decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
      }
    } else {
      decodeFn = decodeBaseline;
    }
    let mcu = 0,
      fileMarker;
    let mcuExpected;
    if (componentsLength === 1) {
      mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
    } else {
      mcuExpected = mcusPerLine * frame.mcusPerColumn;
    }
    let h, v;
    while (mcu < mcuExpected) {
      let mcuToRead = resetInterval ? Math.min(mcuExpected - mcu, resetInterval) : mcuExpected;
      for (i = 0; i < componentsLength; i++) {
        components[i].pred = 0;
      }
      eobrun = 0;
      if (componentsLength === 1) {
        component = components[0];
        for (n = 0; n < mcuToRead; n++) {
          decodeBlock(component, decodeFn, mcu);
          mcu++;
        }
      } else {
        for (n = 0; n < mcuToRead; n++) {
          for (i = 0; i < componentsLength; i++) {
            component = components[i];
            h = component.h;
            v = component.v;
            for (j = 0; j < v; j++) {
              for (k = 0; k < h; k++) {
                decodeMcu(component, decodeFn, mcu, j, k);
              }
            }
          }
          mcu++;
        }
      }
      bitsCount = 0;
      fileMarker = findNextFileMarker(data, offset);
      if (fileMarker && fileMarker.invalid) {
        // (0, _util.warn)('decodeScan - unexpected MCU data, next marker is: ' + fileMarker.invalid);
        offset = fileMarker.offset;
      }
      let marker = fileMarker && fileMarker.marker;
      if (!marker || marker <= 0xFF00) {
        throw new JpegError('marker was not found');
      }
      if (marker >= 0xFFD0 && marker <= 0xFFD7) {
        offset += 2;
      } else {
        break;
      }
    }
    fileMarker = findNextFileMarker(data, offset);
    if (fileMarker && fileMarker.invalid) {
      // (0, _util.warn)('decodeScan - unexpected Scan data, next marker is: ' + fileMarker.invalid);
      offset = fileMarker.offset;
    }
    return offset - startOffset;
  }
  function quantizeAndInverse(component, blockBufferOffset, p) {
    let qt = component.quantizationTable,
      blockData = component.blockData;
    let v0, v1, v2, v3, v4, v5, v6, v7;
    let p0, p1, p2, p3, p4, p5, p6, p7;
    let t;
    if (!qt) {
      throw new JpegError('missing required Quantization Table.');
    }
    for (let row = 0; row < 64; row += 8) {
      p0 = blockData[blockBufferOffset + row];
      p1 = blockData[blockBufferOffset + row + 1];
      p2 = blockData[blockBufferOffset + row + 2];
      p3 = blockData[blockBufferOffset + row + 3];
      p4 = blockData[blockBufferOffset + row + 4];
      p5 = blockData[blockBufferOffset + row + 5];
      p6 = blockData[blockBufferOffset + row + 6];
      p7 = blockData[blockBufferOffset + row + 7];
      p0 *= qt[row];
      if ((p1 | p2 | p3 | p4 | p5 | p6 | p7) === 0) {
        t = dctSqrt2 * p0 + 512 >> 10;
        p[row] = t;
        p[row + 1] = t;
        p[row + 2] = t;
        p[row + 3] = t;
        p[row + 4] = t;
        p[row + 5] = t;
        p[row + 6] = t;
        p[row + 7] = t;
        continue;
      }
      p1 *= qt[row + 1];
      p2 *= qt[row + 2];
      p3 *= qt[row + 3];
      p4 *= qt[row + 4];
      p5 *= qt[row + 5];
      p6 *= qt[row + 6];
      p7 *= qt[row + 7];
      v0 = dctSqrt2 * p0 + 128 >> 8;
      v1 = dctSqrt2 * p4 + 128 >> 8;
      v2 = p2;
      v3 = p6;
      v4 = dctSqrt1d2 * (p1 - p7) + 128 >> 8;
      v7 = dctSqrt1d2 * (p1 + p7) + 128 >> 8;
      v5 = p3 << 4;
      v6 = p5 << 4;
      v0 = v0 + v1 + 1 >> 1;
      v1 = v0 - v1;
      t = v2 * dctSin6 + v3 * dctCos6 + 128 >> 8;
      v2 = v2 * dctCos6 - v3 * dctSin6 + 128 >> 8;
      v3 = t;
      v4 = v4 + v6 + 1 >> 1;
      v6 = v4 - v6;
      v7 = v7 + v5 + 1 >> 1;
      v5 = v7 - v5;
      v0 = v0 + v3 + 1 >> 1;
      v3 = v0 - v3;
      v1 = v1 + v2 + 1 >> 1;
      v2 = v1 - v2;
      t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
      v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
      v7 = t;
      t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
      v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
      v6 = t;
      p[row] = v0 + v7;
      p[row + 7] = v0 - v7;
      p[row + 1] = v1 + v6;
      p[row + 6] = v1 - v6;
      p[row + 2] = v2 + v5;
      p[row + 5] = v2 - v5;
      p[row + 3] = v3 + v4;
      p[row + 4] = v3 - v4;
    }
    for (let col = 0; col < 8; ++col) {
      p0 = p[col];
      p1 = p[col + 8];
      p2 = p[col + 16];
      p3 = p[col + 24];
      p4 = p[col + 32];
      p5 = p[col + 40];
      p6 = p[col + 48];
      p7 = p[col + 56];
      if ((p1 | p2 | p3 | p4 | p5 | p6 | p7) === 0) {
        t = dctSqrt2 * p0 + 8192 >> 14;
        t = t < -2040 ? 0 : t >= 2024 ? 255 : t + 2056 >> 4;
        blockData[blockBufferOffset + col] = t;
        blockData[blockBufferOffset + col + 8] = t;
        blockData[blockBufferOffset + col + 16] = t;
        blockData[blockBufferOffset + col + 24] = t;
        blockData[blockBufferOffset + col + 32] = t;
        blockData[blockBufferOffset + col + 40] = t;
        blockData[blockBufferOffset + col + 48] = t;
        blockData[blockBufferOffset + col + 56] = t;
        continue;
      }
      v0 = dctSqrt2 * p0 + 2048 >> 12;
      v1 = dctSqrt2 * p4 + 2048 >> 12;
      v2 = p2;
      v3 = p6;
      v4 = dctSqrt1d2 * (p1 - p7) + 2048 >> 12;
      v7 = dctSqrt1d2 * (p1 + p7) + 2048 >> 12;
      v5 = p3;
      v6 = p5;
      v0 = (v0 + v1 + 1 >> 1) + 4112;
      v1 = v0 - v1;
      t = v2 * dctSin6 + v3 * dctCos6 + 2048 >> 12;
      v2 = v2 * dctCos6 - v3 * dctSin6 + 2048 >> 12;
      v3 = t;
      v4 = v4 + v6 + 1 >> 1;
      v6 = v4 - v6;
      v7 = v7 + v5 + 1 >> 1;
      v5 = v7 - v5;
      v0 = v0 + v3 + 1 >> 1;
      v3 = v0 - v3;
      v1 = v1 + v2 + 1 >> 1;
      v2 = v1 - v2;
      t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
      v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
      v7 = t;
      t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
      v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
      v6 = t;
      p0 = v0 + v7;
      p7 = v0 - v7;
      p1 = v1 + v6;
      p6 = v1 - v6;
      p2 = v2 + v5;
      p5 = v2 - v5;
      p3 = v3 + v4;
      p4 = v3 - v4;
      p0 = p0 < 16 ? 0 : p0 >= 4080 ? 255 : p0 >> 4;
      p1 = p1 < 16 ? 0 : p1 >= 4080 ? 255 : p1 >> 4;
      p2 = p2 < 16 ? 0 : p2 >= 4080 ? 255 : p2 >> 4;
      p3 = p3 < 16 ? 0 : p3 >= 4080 ? 255 : p3 >> 4;
      p4 = p4 < 16 ? 0 : p4 >= 4080 ? 255 : p4 >> 4;
      p5 = p5 < 16 ? 0 : p5 >= 4080 ? 255 : p5 >> 4;
      p6 = p6 < 16 ? 0 : p6 >= 4080 ? 255 : p6 >> 4;
      p7 = p7 < 16 ? 0 : p7 >= 4080 ? 255 : p7 >> 4;
      blockData[blockBufferOffset + col] = p0;
      blockData[blockBufferOffset + col + 8] = p1;
      blockData[blockBufferOffset + col + 16] = p2;
      blockData[blockBufferOffset + col + 24] = p3;
      blockData[blockBufferOffset + col + 32] = p4;
      blockData[blockBufferOffset + col + 40] = p5;
      blockData[blockBufferOffset + col + 48] = p6;
      blockData[blockBufferOffset + col + 56] = p7;
    }
  }
  function buildComponentData(frame, component) {
    let blocksPerLine = component.blocksPerLine;
    let blocksPerColumn = component.blocksPerColumn;
    let computationBuffer = new Int16Array(64);
    for (let blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
      for (let blockCol = 0; blockCol < blocksPerLine; blockCol++) {
        let offset = getBlockBufferOffset(component, blockRow, blockCol);
        quantizeAndInverse(component, offset, computationBuffer);
      }
    }
    return component.blockData;
  }
  function clamp0to255(a) {
    return a <= 0 ? 0 : a >= 255 ? 255 : a;
  }
  function findNextFileMarker(data, currentPos, startPos) {
    function peekUint16(pos) {
      return data[pos] << 8 | data[pos + 1];
    }
    let maxPos = data.length - 1;
    let newPos = startPos < currentPos ? startPos : currentPos;
    if (currentPos >= maxPos) {
      return null;
    }
    let currentMarker = peekUint16(currentPos);
    if (currentMarker >= 0xFFC0 && currentMarker <= 0xFFFE) {
      return {
        invalid: null,
        marker: currentMarker,
        offset: currentPos,
      };
    }
    let newMarker = peekUint16(newPos);
    while (!(newMarker >= 0xFFC0 && newMarker <= 0xFFFE)) {
      if (++newPos >= maxPos) {
        return null;
      }
      newMarker = peekUint16(newPos);
    }
    return {
      invalid: currentMarker.toString(16),
      marker: newMarker,
      offset: newPos,
    };
  }
  JpegImage.prototype = {
    parse: function parse(data) {
      function readUint16() {
        let value = data[offset] << 8 | data[offset + 1];
        offset += 2;
        return value;
      }
      function readDataBlock() {
        let length = readUint16();
        let endOffset = offset + length - 2;
        let fileMarker = findNextFileMarker(data, endOffset, offset);
        if (fileMarker && fileMarker.invalid) {
          // (0, _util.warn)('readDataBlock - incorrect length, next marker is: ' + fileMarker.invalid);
          endOffset = fileMarker.offset;
        }
        let array = data.subarray(offset, endOffset);
        offset += array.length;
        return array;
      }
      function prepareComponents(frame) {
        let mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / frame.maxH);
        let mcusPerColumn = Math.ceil(frame.scanLines / 8 / frame.maxV);
        for (let i = 0; i < frame.components.length; i++) {
          component = frame.components[i];
          let blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / frame.maxH);
          let blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / frame.maxV);
          let blocksPerLineForMcu = mcusPerLine * component.h;
          let blocksPerColumnForMcu = mcusPerColumn * component.v;
          let blocksBufferSize = 64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1);
          component.blockData = new Int16Array(blocksBufferSize);
          component.blocksPerLine = blocksPerLine;
          component.blocksPerColumn = blocksPerColumn;
        }
        frame.mcusPerLine = mcusPerLine;
        frame.mcusPerColumn = mcusPerColumn;
      }
      var offset = 0;
      let jfif = null;
      let adobe = null;
      let frame, resetInterval;
      let quantizationTables = [];
      let huffmanTablesAC = [],
        huffmanTablesDC = [];
      let fileMarker = readUint16();
      if (fileMarker !== 0xFFD8) {
        throw new JpegError('SOI not found');
      }
      fileMarker = readUint16();
      while (fileMarker !== 0xFFD9) {
        var i, j, l;
        switch (fileMarker) {
          case 0xFFE0:
          case 0xFFE1:
          case 0xFFE2:
          case 0xFFE3:
          case 0xFFE4:
          case 0xFFE5:
          case 0xFFE6:
          case 0xFFE7:
          case 0xFFE8:
          case 0xFFE9:
          case 0xFFEA:
          case 0xFFEB:
          case 0xFFEC:
          case 0xFFED:
          case 0xFFEE:
          case 0xFFEF:
          case 0xFFFE:
            var appData = readDataBlock();
            if (fileMarker === 0xFFE0) {
              if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 && appData[3] === 0x46 && appData[4] === 0) {
                jfif = {
                  version: {
                    major: appData[5],
                    minor: appData[6],
                  },
                  densityUnits: appData[7],
                  xDensity: appData[8] << 8 | appData[9],
                  yDensity: appData[10] << 8 | appData[11],
                  thumbWidth: appData[12],
                  thumbHeight: appData[13],
                  thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13]),
                };
              }
            }
            if (fileMarker === 0xFFEE) {
              if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F && appData[3] === 0x62 && appData[4] === 0x65) {
                adobe = {
                  version: appData[5] << 8 | appData[6],
                  flags0: appData[7] << 8 | appData[8],
                  flags1: appData[9] << 8 | appData[10],
                  transformCode: appData[11],
                };
              }
            }
            break;
          case 0xFFDB:
            var quantizationTablesLength = readUint16();
            var quantizationTablesEnd = quantizationTablesLength + offset - 2;
            var z;
            while (offset < quantizationTablesEnd) {
              let quantizationTableSpec = data[offset++];
              let tableData = new Uint16Array(64);
              if (quantizationTableSpec >> 4 === 0) {
                for (j = 0; j < 64; j++) {
                  z = dctZigZag[j];
                  tableData[z] = data[offset++];
                }
              } else if (quantizationTableSpec >> 4 === 1) {
                for (j = 0; j < 64; j++) {
                  z = dctZigZag[j];
                  tableData[z] = readUint16();
                }
              } else {
                throw new JpegError('DQT - invalid table spec');
              }
              quantizationTables[quantizationTableSpec & 15] = tableData;
            }
            break;
          case 0xFFC0:
          case 0xFFC1:
          case 0xFFC2:
            if (frame) {
              throw new JpegError('Only single frame JPEGs supported');
            }
            readUint16();
            frame = {};
            frame.extended = fileMarker === 0xFFC1;
            frame.progressive = fileMarker === 0xFFC2;
            frame.precision = data[offset++];
            frame.scanLines = readUint16();
            frame.samplesPerLine = readUint16();
            frame.components = [];
            frame.componentIds = {};
            var componentsCount = data[offset++],
              componentId;
            var maxH = 0,
              maxV = 0;
            for (i = 0; i < componentsCount; i++) {
              componentId = data[offset];
              let h = data[offset + 1] >> 4;
              let v = data[offset + 1] & 15;
              if (maxH < h) {
                maxH = h;
              }
              if (maxV < v) {
                maxV = v;
              }
              let qId = data[offset + 2];
              l = frame.components.push({
                h: h,
                v: v,
                quantizationId: qId,
                quantizationTable: null,
              });
              frame.componentIds[componentId] = l - 1;
              offset += 3;
            }
            frame.maxH = maxH;
            frame.maxV = maxV;
            prepareComponents(frame);
            break;
          case 0xFFC4:
            var huffmanLength = readUint16();
            for (i = 2; i < huffmanLength;) {
              let huffmanTableSpec = data[offset++];
              let codeLengths = new Uint8Array(16);
              let codeLengthSum = 0;
              for (j = 0; j < 16; j++ , offset++) {
                codeLengthSum += codeLengths[j] = data[offset];
              }
              let huffmanValues = new Uint8Array(codeLengthSum);
              for (j = 0; j < codeLengthSum; j++ , offset++) {
                huffmanValues[j] = data[offset];
              }
              i += 17 + codeLengthSum;
              (huffmanTableSpec >> 4 === 0 ? huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
            }
            break;
          case 0xFFDD:
            readUint16();
            resetInterval = readUint16();
            break;
          case 0xFFDA:
            readUint16();
            var selectorsCount = data[offset++];
            var components = [],
              component;
            for (i = 0; i < selectorsCount; i++) {
              let componentIndex = frame.componentIds[data[offset++]];
              component = frame.components[componentIndex];
              let tableSpec = data[offset++];
              component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
              component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
              components.push(component);
            }
            var spectralStart = data[offset++];
            var spectralEnd = data[offset++];
            var successiveApproximation = data[offset++];
            var processed = decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successiveApproximation >> 4, successiveApproximation & 15);
            offset += processed;
            break;
          case 0xFFFF:
            if (data[offset] !== 0xFF) {
              offset--;
            }
            break;
          default:
            if (data[offset - 3] === 0xFF && data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
              offset -= 3;
              break;
            }
            throw new JpegError('unknown marker ' + fileMarker.toString(16));
        }
        fileMarker = readUint16();
      }
      this.width = frame.samplesPerLine;
      this.height = frame.scanLines;
      this.jfif = jfif;
      this.adobe = adobe;
      this.components = [];
      for (i = 0; i < frame.components.length; i++) {
        component = frame.components[i];
        let quantizationTable = quantizationTables[component.quantizationId];
        if (quantizationTable) {
          component.quantizationTable = quantizationTable;
        }
        this.components.push({
          output: buildComponentData(frame, component),
          scaleX: component.h / frame.maxH,
          scaleY: component.v / frame.maxV,
          blocksPerLine: component.blocksPerLine,
          blocksPerColumn: component.blocksPerColumn,
        });
      }
      this.numComponents = this.components.length;
    },
    getData: function(imageData) {
      let data = imageData.data;
      let components = this.components;
      let lineData = new Uint8Array((components[0].blocksPerLine << 3) * components[0].blocksPerColumn * 8);

      // NOTICE: This forces BGR->RGB conversion without adding any costs, since really we know this is going to be a hacky BGRA BLP file.
      [components[0], components[2]] = [components[2], components[0]];

      for (let i = 0, numComponents = components.length; i < numComponents; i++) {
        let component = components[i];
        let blocksPerLine = component.blocksPerLine;
        let blocksPerColumn = component.blocksPerColumn;
        let samplesPerLine = blocksPerLine << 3;
        var j, k, ll = 0;
        var lineOffset = 0;

        for (let blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
          let scanLine = blockRow << 3;

          for (let blockCol = 0; blockCol < blocksPerLine; blockCol++) {
            let bufferOffset = getBlockBufferOffset(component, blockRow, blockCol);
            let offset2 = 0, sample = blockCol << 3;

            for (j = 0; j < 8; j++) {
              var lineOffset = (scanLine + j) * samplesPerLine;

              for (k = 0; k < 8; k++) {
                lineData[lineOffset + sample + k] = component.output[bufferOffset + offset2++];
              }
            }
          }
        }

        let offset = i;

        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            data[offset] = lineData[y * samplesPerLine + x];
            offset += numComponents;
          }
        }
      }

      return data;
    },
  };
  return JpegImage;
}();
exports.JpegImage = JpegImage;
