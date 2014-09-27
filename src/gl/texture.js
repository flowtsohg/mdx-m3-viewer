function Texture(source, onload, onerror) {
  var image = new Image(),
        self = this;
        
  image.onload = function (e) {
    var id = ctx.createTexture();
    
    ctx.bindTexture(ctx.TEXTURE_2D, id);
    textureOptions(ctx.REPEAT, ctx.REPEAT, ctx.LINEAR, ctx.LINEAR_MIPMAP_LINEAR);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.generateMipmap(ctx.TEXTURE_2D);
    
    self.id = id;
    self.ready = true;
    
    // Because Texture is async, unlike all the other texture types, it must explicitly call onload
    onload({isTexture: 1, source: source});
  };
  
  image.onerror = function (e) {
    onerror({isTexture: 1, source: source}, "404");
  };
  
  image.src = source;
}