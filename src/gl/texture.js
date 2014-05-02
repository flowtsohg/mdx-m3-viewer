function onloadTexture(image, e) {
  this.id = gl["createTexture"]();
  gl["bindTexture"](gl["TEXTURE_2D"], this.id);
  textureOptions("REPEAT", "REPEAT", "LINEAR", "LINEAR_MIPMAP_LINEAR");
  gl["texImage2D"](gl["TEXTURE_2D"], 0, gl["RGBA"], gl["RGBA"], gl["UNSIGNED_BYTE"], image);
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