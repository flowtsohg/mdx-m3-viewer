function SD(sd) {
  this.sd = sd;
}

SD.prototype = {
  getValue: function (index, animationReference, frame, runsConcurrent) {
    var sd = this.sd[index];
    
    if (runsConcurrent === 1) {
      frame = frame % sd.biggestKey;
    }
    
    var keys = sd.keys;
    var values = sd.values;
    var interval = this.getInterval(keys, frame);
    var a = interval[0];
    var b = interval[1];
    var length = keys.length;
    
    if (a === length) {
      if (b === length) {
        return animationReference.initValue;
      } else {
        return values[b];
      }
    }
    
    if (b === length || a >= b) {
      return values[a];
    }
    
    var t = math.clamp((frame - keys[a]) / (keys[b] - keys[a]), 0, 1);
    var func = typeof values[a] === "number" ? math.interpolator.scalar : (values[a].length === 3 ? math.interpolator.vector : math.interpolator.quaternion);
    
    // M3 doesn't seem to have hermite/bezier interpolations, so just feed 0 to the in/out tangents since they are not used anyway
    return func(values[a], 0, 0, values[b], t, animationReference.interpolationType);
  },
  
  getInterval: function (keys, frame) {
    var a = keys.length;
    var b = 0;
    
    while (b !== keys.length && frame > keys[b]) {
      a = b;
      b++;
    }
    
    return [a, b];
  }
};