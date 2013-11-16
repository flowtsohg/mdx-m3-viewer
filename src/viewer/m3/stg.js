// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function STG(stg, sts, stc) {
  this.name = stg.name;
  this.stcIndices = stg.stcIndices;
  this.sts = sts;
  this.stc = stc;
}

STG.prototype = {
  getValue: function (animationReference, frame) {
    var i, l;
    var stcIndices = this.stcIndices;
    
    for (i = 0, l = stcIndices.length; i < l; i++) {
      var index = stcIndices[i];
      var stc = this.stc[index];
      var sts = this.sts[stc.stsIndex];
      
       // First check if this STC actually has data for this animation reference
        if (sts.hasData(animationReference)) {
          // Since this STC has data for this animation reference, return it
          return stc.getValue(animationReference, frame);
        }
    }
    
    // No STC referenced by the STG had data for this animation reference
    return animationReference.initValue;
  }
};