var BLP1_MAGIC = 0x31504c42;
  
var BLP_JPG = 0x0;
var BLP_PALLETE = 0x1;

function onloadBLPTexture(e) {
  var date = new Date();
  var status = e.target.status;
  
  if (status !== 200) {
    this.onerror("" + status);
    return;
  }
  
  var arrayBuffer = e.target.response;
  // If compression=0, the header size is 40
  // If compression=1, the header size is 39
  // Might as well make one typed array for both
  var header = new Int32Array(arrayBuffer, 0, 40);
  
  if (header[0] !== BLP1_MAGIC) {
    this.onerror("Format");
    return;
  }
  
  var arrayData = new Uint8Array(arrayBuffer);
  var compression = header[1];
  var width = header[3];
  var height = header[4];
  var pictureType = header[5];
  var mipmapOffset = header[7];
  var mipmapSize = header[23];
  var rgba8888Data;
  
  if (compression === BLP_JPG) {
    var jpegHeaderSize = header[39];
    var jpegHeader = new Uint8Array(arrayBuffer, 160, jpegHeaderSize)
    var jpegData = new Uint8Array(jpegHeaderSize + mipmapSize);
    
    jpegData.set(jpegHeader);
    jpegData.set(arrayData.subarray(mipmapOffset, mipmapOffset + mipmapSize), jpegHeaderSize);
    
    var jpegImage = new JpegImage();
    
    jpegImage.loadFromBuffer(jpegData);
    
    rgba8888Data = jpegImage.getData(jpegImage.width, jpegImage.height);
  } else {
    var pallete = new Uint8Array(arrayBuffer, 156, 1024);
    var size = width * height;
    var mipmapAlphaOffset = mipmapOffset + size;
    var i, dstI;
    
    rgba8888Data = new Uint8Array(size * 4);
    
    for (var index = 0; index < size; index++) {
      i = arrayData[mipmapOffset + index] * 4;
      dstI = index * 4;
      
      rgba8888Data[dstI] = pallete[i + 2];
      rgba8888Data[dstI + 1] = pallete[i + 1];
      rgba8888Data[dstI + 2] = pallete[i];
      
      if (pictureType === 3 || pictureType === 4) {
        rgba8888Data[dstI + 3] = arrayData[mipmapAlphaOffset + index]
      } else {
        rgba8888Data[dstI + 3] = 255 - pallete[i + 3];
      }
    }
  }
  
  this.id = gl["createTexture"]();
  gl["bindTexture"](gl["TEXTURE_2D"], this.id);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_WRAP_S"], gl["REPEAT"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_WRAP_T"], gl["REPEAT"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_MAG_FILTER"], gl["LINEAR"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_MIN_FILTER"], gl["LINEAR_MIPMAP_LINEAR"]);
  gl["texImage2D"](gl["TEXTURE_2D"], 0, gl["RGBA"], width, height, 0, gl["RGBA"], gl["UNSIGNED_BYTE"], rgba8888Data);
  gl["generateMipmap"](gl["TEXTURE_2D"]);
  
  this.ready = true;
  this.onload(this);
}

function BLPTexture(source) {
  this.isTexture = true;
  this.source = source;
  
  this.onload = onload;
  this.onerror = onerror.bind(this);
  
  getFile(source, true, onloadBLPTexture, this.onerror, onprogress.bind(this));
}