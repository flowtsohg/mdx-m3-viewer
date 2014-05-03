function onloadTexture(image, e) {
  this.id = ctx.createTexture();
  ctx.bindTexture(ctx.TEXTURE_2D, this.id);
  textureOptions(ctx.REPEAT, ctx.REPEAT, ctx.LINEAR, ctx.LINEAR_MIPMAP_LINEAR);
  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
  ctx.generateMipmap(ctx.TEXTURE_2D);
  
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