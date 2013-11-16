// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function STS(sts) {
  var i, l;
  var animIds = sts.animIds;
  
  this.animIds = {};
    
  // Allows direct checks instead of loops
  for (i = 0, l = animIds.length; i < l; i++) {
    this.animIds[animIds[i]] = i;
  }
}

STS.prototype = {
  hasData: function (animationReference) {
    return !!this.animIds[animationReference.animId];
  }
};