// Abstract texture implementation.
// Defines a skeleton texture which can be extended.
window["BaseTexture"] = function (source, onload, onerror, onprogress, clampS, clampT, context) {
  this.isTexture = true;
  this.source = source;
  
  this.onload = onload;
  this.onerror = onerror.bind(this);
  
  this.clampS = clampS;
  this.clampT = clampT;
  
  getFile(source, true, this.onloadStatus.bind(this, context), this.onerror, onprogress.bind(this));
}

BaseTexture.prototype = {
  onloadStatus: function (context, e) {
    var target = e.target,
          status = target.status;
    
    if (status !== 200) {
      this.onerror("" + status);
      return
    }
    
    this.onloadTexture(target.response, context);
  },
  
  onloadTexture: function (arrayBuffer, context) {
    
  }
};