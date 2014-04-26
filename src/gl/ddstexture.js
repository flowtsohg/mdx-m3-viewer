// Note: This file is largely based on https://github.com/toji/webgl-texture-utils/blob/master/texture-util/dds.js

var DDS_MAGIC = 0x20534444;
  
var DDSD_MIPMAPCOUNT = 0x20000;

var DDPF_FOURCC = 0x4;

var FOURCC_DXT1 = 0x31545844;
//var FOURCC_DXT2 = 0x32545844;
var FOURCC_DXT3 = 0x33545844;
//var FOURCC_DXT4 = 0x34545844;
var FOURCC_DXT5 = 0x35545844;

function int32ToFourCC(value) {
  return String.fromCharCode(value & 0xff, (value >> 8) & 0xff,  (value >> 16) & 0xff, (value >> 24) & 0xff);
}

var int4to8 = 255 / 15;
var int5to8 = 255 / 31;
var int6to8 = 255 / 63;

// 4 bit alpha
function setRgba8888Dxt3(dst, i, int565, a) {
  dst[i] = Math.floor(((int565 >> 11) & 31) * int5to8);
  dst[i + 1] = Math.floor(((int565 >> 5) & 63) * int6to8);
  dst[i + 2] = Math.floor((int565 & 31) * int5to8);
  dst[i + 3] = Math.floor(a * int4to8);
}

// 8 bit alpha
function setRgba8888Dxt5(dst, i, int565, a) {
  dst[i] = Math.floor(((int565 >> 11) & 31) * int5to8);
  dst[i + 1] = Math.floor(((int565 >> 5) & 63) * int6to8);
  dst[i + 2] = Math.floor((int565 & 31) * int5to8);
  dst[i + 3] = a;
}

function dxt1ToRgb565(src, width, height) {
  var c = new Uint16Array(4);
  var dst = new Uint16Array(width * height);
  var m;
  var dstI;
  var i;
  var r0, g0, b0, r1, g1, b1;
  var blockWidth = width / 4;
  var blockHeight = height / 4;
  
  for (var blockY = 0; blockY < blockHeight; blockY++) {
    for (var blockX = 0; blockX < blockWidth; blockX++) {
      i = 4 * (blockY * blockWidth + blockX);
      c[0] = src[i];
      c[1] = src[i + 1];
      r0 = c[0] & 0x1f;
      g0 = c[0] & 0x7e0;
      b0 = c[0] & 0xf800;
      r1 = c[1] & 0x1f;
      g1 = c[1] & 0x7e0;
      b1 = c[1] & 0xf800;
      
      if (c[0] > c[1]) {
        c[2] = ((5 * r0 + 3 * r1) >> 3) | (((5 * g0 + 3 * g1) >> 3) & 0x7e0) | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
        c[3] = ((5 * r1 + 3 * r0) >> 3) | (((5 * g1 + 3 * g0) >> 3) & 0x7e0) | (((5 * b1 + 3 * b0) >> 3) & 0xf800);
      } else {
        c[2] = (c[0] + c[1]) >> 1;
        c[3] = 0;
      }
      
      m = src[i + 2];
      dstI = (blockY * 4) * width + blockX * 4;
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

function dxt3ToRgba8888(src, width, height) {
  var c = new Uint16Array(4);
  var dst = new Uint8Array(width * height * 4);
  var m;
  var a;
  var dstI;
  var i;
  var r0, g0, b0, r1, g1, b1;
  var blockWidth = width / 4;
  var blockHeight = height / 4;
  
  for (var blockY = 0; blockY < blockHeight; blockY++) {
    for (var blockX = 0; blockX < blockWidth; blockX++) {
      i = 8 * (blockY * blockWidth + blockX);
      c[0] = src[i + 4];
      c[1] = src[i + 5];
      r0 = c[0] & 0x1f;
      g0 = c[0] & 0x7e0;
      b0 = c[0] & 0xf800;
      r1 = c[1] & 0x1f;
      g1 = c[1] & 0x7e0;
      b1 = c[1] & 0xf800;
      c[2] = ((5 * r0 + 3 * r1) >> 3) | (((5 * g0 + 3 * g1) >> 3) & 0x7e0) | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
      c[3] = ((5 * r1 + 3 * r0) >> 3) | (((5 * g1 + 3 * g0) >> 3) & 0x7e0) | (((5 * b1 + 3 * b0) >> 3) & 0xf800);
      
      m = src[i + 6];
      a = src[i];
      dstI = (blockY * 16) * width + blockX * 16;
      setRgba8888Dxt3(dst, dstI, c[m & 0x3], a & 0xf);
      setRgba8888Dxt3(dst, dstI + 4, c[(m >> 2) & 0x3], (a >> 4) & 0xf);
      setRgba8888Dxt3(dst, dstI + 8, c[(m >> 4) & 0x3], (a >> 8) & 0xf);
      setRgba8888Dxt3(dst, dstI + 12, c[(m >> 6) & 0x3], (a >> 12) & 0xf);
      dstI += width * 4;
      a = src[i + 1];
      setRgba8888Dxt3(dst, dstI, c[(m >> 8) & 0x3], a & 0xf);
      setRgba8888Dxt3(dst, dstI + 4, c[(m >> 10) & 0x3], (a >> 4) & 0xf);
      setRgba8888Dxt3(dst, dstI + 8, c[(m >> 12) & 0x3], (a >> 8) & 0xf);
      setRgba8888Dxt3(dst, dstI + 12, c[m >> 14], (a >> 12) & 0xf);
      m = src[i + 7];
      a = src[i + 2];
      dstI += width * 4;
      setRgba8888Dxt3(dst, dstI, c[m & 0x3], a & 0xf);
      setRgba8888Dxt3(dst, dstI + 4, c[(m >> 2) & 0x3], (a >> 4) & 0xf);
      setRgba8888Dxt3(dst, dstI + 8, c[(m >> 4) & 0x3], (a >> 8) & 0xf);
      setRgba8888Dxt3(dst, dstI + 12, c[(m >> 6) & 0x3], (a >> 12) & 0xf);
      dstI += width * 4;
      a = src[i + 3];
      setRgba8888Dxt3(dst, dstI, c[(m >> 8) & 0x3], a & 0xf);
      setRgba8888Dxt3(dst, dstI + 4, c[(m >> 10) & 0x3], (a >> 4) & 0xf);
      setRgba8888Dxt3(dst, dstI + 8, c[(m >> 12) & 0x3], (a >> 8) & 0xf);
      setRgba8888Dxt3(dst, dstI + 12, c[m >> 14], (a >> 12) & 0xf);
    }
  }
  
  return dst;
}

function dxt5ToRgba8888(src, width, height) {
  var c = new Uint16Array(4);
  var a = new Uint8Array(8);
  var alphaBits;
  var dst = new Uint8Array(width * height * 4);
  var m;
  var a;
  var dstI;
  var i;
  var r0, g0, b0, r1, g1, b1;
  var blockWidth = width / 4;
  var blockHeight = height / 4;
  
  for (var blockY = 0; blockY < blockHeight; blockY++) {
    for (var blockX = 0; blockX < blockWidth; blockX++) {
      i = 8 * (blockY * blockWidth + blockX);
      c[0] = src[i + 4];
      c[1] = src[i + 5];
      r0 = c[0] & 0x1f;
      g0 = c[0] & 0x7e0;
      b0 = c[0] & 0xf800;
      r1 = c[1] & 0x1f;
      g1 = c[1] & 0x7e0;
      b1 = c[1] & 0xf800;
      c[2] = ((5 * r0 + 3 * r1) >> 3) | (((5 * g0 + 3 * g1) >> 3) & 0x7e0) | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
      c[3] = ((5 * r1 + 3 * r0) >> 3) | (((5 * g1 + 3 * g0) >> 3) & 0x7e0) | (((5 * b1 + 3 * b0) >> 3) & 0xf800);
      alphaBits = src[i + 1] + 65536 * (src[i + 2] + 65536 * src[i + 3]);
      a[0] = src[i] & 0xff;
      a[1] = src[i]  >> 8;
      
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
        a[7] = 1
        
        /*
        a[2] = (4 * a[0] + a[1]) / 5;
        a[3] = (3 * a[0] + 2 * a[1]) / 5;
        a[4] = (2 * a[0] + 3 * a[1]) / 5;
        a[5] = (a[0] + 4 * a[1]) / 5;
        a[6] = 0;
        a[7] = 1;
        //*/
      }
      
      m = src[i + 6];
      dstI = (blockY * 16) * width + blockX * 16;
      setRgba8888Dxt5(dst, dstI, c[m & 0x3], a[alphaBits & 0x7]);
      setRgba8888Dxt5(dst, dstI + 4, c[(m >> 2) & 0x3], a[(alphaBits >> 3) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 8, c[(m >> 4) & 0x3], a[(alphaBits >> 6) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 12, c[(m >> 6) & 0x3], a[(alphaBits >> 9) & 0x7]);
      dstI += width * 4;
      setRgba8888Dxt5(dst, dstI, c[(m >> 8) & 0x3], a[(alphaBits >> 12) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 4, c[(m >> 10) & 0x3], a[(alphaBits >> 15) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 8, c[(m >> 12) & 0x3], a[(alphaBits >> 18) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 12, c[m >> 14], a[(alphaBits >> 21) & 0x7]);
      m = src[i + 7];
      dstI += width * 4;
      setRgba8888Dxt5(dst, dstI, c[m & 0x3], a[(alphaBits >> 24) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 4, c[(m >> 2) & 0x3], a[(alphaBits >> 27) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 8, c[(m >> 4) & 0x3], a[(alphaBits >> 30) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 12, c[(m >> 6) & 0x3],a[(alphaBits >> 33) & 0x7]);
      dstI += width * 4;
      setRgba8888Dxt5(dst, dstI, c[(m >> 8) & 0x3], a[(alphaBits >> 36) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 4, c[(m >> 10) & 0x3], a[(alphaBits >> 39) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 8, c[(m >> 12) & 0x3], a[(alphaBits >> 42) & 0x7]);
      setRgba8888Dxt5(dst, dstI + 12, c[m >> 14], a[(alphaBits >> 45) & 0x7]);
    }
  }
  
  return dst;
}
  
function onloadDDSTexture(e) {
  var date = new Date();
  var status = e.target.status;
  
  if (status !== 200) {
    this.onerror("" + status);
    return;
  }
  
  var arrayBuffer = e.target.response;
  var header = new Int32Array(arrayBuffer, 0, 31);
  
  if (header[0] !== DDS_MAGIC) {
    this.onerror("Format");
    return;
  }
  
  if (!header[20] & DDPF_FOURCC) {
    this.onerror("FourCC");
    return;
  }
  
  var fourCC = header[21];
  var blockBytes, internalFormat;
  
  if (fourCC === FOURCC_DXT1) {
    blockBytes = 8;
    internalFormat = compressedTextures ? compressedTextures["COMPRESSED_RGBA_S3TC_DXT1_EXT"] : null;
  } else if (fourCC === FOURCC_DXT3) {
    blockBytes = 16;
    internalFormat = compressedTextures ? compressedTextures["COMPRESSED_RGBA_S3TC_DXT3_EXT"] : null;
  } else if (fourCC === FOURCC_DXT5) {
    blockBytes = 16;
    internalFormat = compressedTextures ? compressedTextures["COMPRESSED_RGBA_S3TC_DXT5_EXT"] : null;
  } else {
    this.onerror(int32ToFourCC(fourCC));
    return;
  }
  
  var mipmapCount = 1;
  
  if (header[2] & DDSD_MIPMAPCOUNT) {
    mipmapCount = Math.max(1, header[7]);
  }
  
  var width = header[4];
  var height = header[3];
  var dataOffset = header[1] + 4;
  var dataLength, byteArray;
  var rgb565Data, rgba8888Data;
  
  this.id = gl["createTexture"]();
  gl["bindTexture"](gl["TEXTURE_2D"], this.id);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_WRAP_S"], gl["REPEAT"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_WRAP_T"], gl["REPEAT"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_MAG_FILTER"], gl["LINEAR"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_MIN_FILTER"], mipmapCount > 1 ? gl["LINEAR_MIPMAP_LINEAR"] : gl["LINEAR"]);
  
  if (internalFormat) {
    for (var i = 0; i < mipmapCount; i++) {
      dataLength = Math.max(4, width) / 4 * Math.max( 4, height ) / 4 * blockBytes;
      byteArray = new Uint8Array(arrayBuffer, dataOffset, dataLength);
      gl["compressedTexImage2D"](gl["TEXTURE_2D"], i, internalFormat, width, height, 0, byteArray);
      dataOffset += dataLength;
      width *= 0.5;
      height *= 0.5;
    }
  } else {
    dataLength = Math.max(4, width) / 4 * Math.max( 4, height ) / 4 * blockBytes;
    byteArray = new Uint16Array(arrayBuffer, dataOffset);
    
    if (fourCC === FOURCC_DXT1) {
      rgb565Data = dxt1ToRgb565(byteArray, width, height);
      
      gl["texImage2D"](gl["TEXTURE_2D"], 0, gl["RGB"], width, height, 0, gl["RGB"], gl["UNSIGNED_SHORT_5_6_5"], rgb565Data);
      gl["generateMipmap"](gl["TEXTURE_2D"]);
    } else if (fourCC === FOURCC_DXT3) {
      rgba8888Data = dxt3ToRgba8888(byteArray, width, height);
      
      gl["texImage2D"](gl["TEXTURE_2D"], 0, gl["RGBA"], width, height, 0, gl["RGBA"], gl["UNSIGNED_BYTE"], rgba8888Data);
      gl["generateMipmap"](gl["TEXTURE_2D"]);
    } else {
      rgba8888Data = dxt5ToRgba8888(byteArray, width, height);
      
      gl["texImage2D"](gl["TEXTURE_2D"], 0, gl["RGBA"], width, height, 0, gl["RGBA"], gl["UNSIGNED_BYTE"], rgba8888Data);
      gl["generateMipmap"](gl["TEXTURE_2D"]);
    }
  }
  
  this.ready = true;
  this.onload(this);
}

function DDSTexture(source, onload, onerror, onprogress) {
  this.isTexture = true;
  this.source = source;
  
  this.onload = onload;
  this.onerror = onerror.bind(this);
  
  getFile(source, true, onloadDDSTexture.bind(this), this.onerror, onprogress.bind(this));
}