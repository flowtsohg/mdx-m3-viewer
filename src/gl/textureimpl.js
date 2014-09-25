// Texture mixin.
// Defines a skeleton texture which can be extended.
var TextureImpl = (function () {
  function onloadTexture(arrayBuffer) {
    
  }
  
  function onloadImpl(e) {
    var target = e.target,
          status = target.status;
    
    if (status !== 200) {
      this.onerror("" + status);
      return
    }
    
    this.onloadTexture(target.response);
  }
  
  function setupImpl(source, onload, onerror, onprogress, clampS, clampT) {
    this.isTexture = true;
    this.source = source;
    
    this.onload = onload;
    this.onerror = onerror.bind(this);
    
    this.clampS = clampS;
    this.clampT = clampT;
    
    getFile(source, true, this.onloadImpl.bind(this), this.onerror, onprogress.bind(this));
  }
  
  return function () {
    if (!this.setupImpl) { this.setupImpl = setupImpl; }
    if (!this.onloadImpl) { this.onloadImpl = onloadImpl; }
    if (!this.onloadTexture) { this.onloadTexture = onloadTexture; }
    
    return this;
  };
}());