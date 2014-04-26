function onloadTexture(image, e) {
  this.id = gl["createTexture"]();
  gl["bindTexture"](gl["TEXTURE_2D"], this.id);
  gl["texImage2D"](gl["TEXTURE_2D"], 0, gl["RGBA"], gl["RGBA"], gl["UNSIGNED_BYTE"], image);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_WRAP_S"], gl["REPEAT"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_WRAP_T"], gl["REPEAT"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_MAG_FILTER"], gl["LINEAR"]);
  gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_MIN_FILTER"], gl["LINEAR_MIPMAP_LINEAR"]);
  gl["generateMipmap"](gl["TEXTURE_2D"]);
  
  this.ready = true;
  this.onload(this);
}

function Texture(source, onload, onerror, onprogress) {
  this.isTexture = true;
  this.source = source;
  
  var image = new Image();
  
  this.onload = onload;
  
  image.onload = onloadTexture.bind(this, image);
  image.onerror = onerror.bind(this);
  
  image.src = source;
}