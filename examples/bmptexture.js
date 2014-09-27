// A simple 24-bit BMP handler
// ctx is a WebGLRenderingContext object.
function BMPTexture(arrayBuffer, options, onerror, ctx) {
  // Simple binary reader implementation, see src/binaryreader.
  var binaryReader = new BinaryReader(arrayBuffer);
  
  // BMP magic identifier
  if (read(binaryReader, 2) !== "BM") {
    error("BMP: BadFormat");
    return;
  }
  
  skip(binaryReader, 8);
  
  var dataOffset = readUint32(binaryReader);
  
  skip(binaryReader, 4);
  
  var width = readUint32(binaryReader);
  var height = readUint32(binaryReader);
  
  skip(binaryReader, 2);
  
  var bpp = readUint16(binaryReader);
  
  if (bpp !== 24) {
    error("BMP: Only 24 bits per pixel supported");
    return;
  }
  
  var compression = readUint32(binaryReader);
  
  if (compression !== 0) {
    error("BMP: compressed images are not supported");
  }
  
  seek(binaryReader, dataOffset);
  
  // Read width*height RGB pixels
  var data = readUint8Array(binaryReader, width * height * 3);
  
  var id = ctx.createTexture();
  ctx.bindTexture(ctx.TEXTURE_2D, id);
  ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 1);
  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGB, width, height, 0, ctx.RGB, ctx.UNSIGNED_BYTE, data);
  ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 0);
  ctx.generateMipmap(ctx.TEXTURE_2D);
  
  this.id = id; // Must be set
  this.ready = true; // Must be set
}