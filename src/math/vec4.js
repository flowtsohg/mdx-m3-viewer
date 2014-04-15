var Vec4 = {
  setFromValues: function (v0, x, y, z, w) {
    v0[0] = x;
    v0[1] = y;
    v0[2] = z;
    v0[3] = w;
  },

  setFromArray: function (v0, a) {
    v0[0] = a[0];
    v0[1] = a[1];
    v0[2] = a[2];
    v0[3] = a[3];
  },

  add: function (v0, v1, out) {
    out[0] = v0[0] + v1[0];
    out[1] = v0[1] + v1[1];
    out[2] = v0[2] + v1[2];
    out[3] = v0[3] + v1[3];
    
    return out;
  },

  subtract: function (v0, v1, out) {
    out[0] = v0[0] - v1[0];
    out[1] = v0[1] - v1[1];
    out[2] = v0[2] - v1[2];
    out[3] = v0[3] - v1[3];
    
    return out;
  },

  negate: function (v0, out) {
    out[0] = -v0[0];
    out[1] = -v0[1];
    out[2] = -v0[2];
    out[3] = -v0[3];
    
    return out;
  },

  scale: function (v0, scalar, out) {
    out[0] = v0[0] * scalar;
    out[1] = v0[1] * scalar;
    out[2] = v0[2] * scalar;
    out[3] = v0[3] * scalar;
    
    return out;
  },

  magnitudeSquared: function (v0) {
    var x = v0[0], y = v0[1], z = v0[2], w = v0[3];
    
    return (x * x + y * y + z * z + w * w);
  },

  magnitude: function (v0) {
    var x = v0[0], y = v0[1], z = v0[2], w = v0[3];
    
    return Math.sqrt(x * x + y * y + z * z + w * w);
  },

  normalize: function (v0, out) {
    var l = 1 / this.magnitude(v0);
    
    out[0] = v0[0] * l;
    out[1] = v0[1] * l;
    out[2] = v0[2] * l;
    out[3] = v0[3] * l;
    
    return out;
  },

  dot: function (v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2] + v0[3] * v1[3];
  },

  lerp: function (v0, v1, t, out) {
    var x = v0[0], y = v0[1], z = v0[2], w = v0[3];
    
    out[0] = (v1[0] - x) * t + x;
    out[1] = (v1[1] - y) * t + y;
    out[2] = (v1[2] - z) * t + z;
    out[3] = (v1[3] - w) * t + w;
    
    return out;
  },

  equals: function (v0, v1) {
    return v0.length === v1.length && v0[0] === v1[0] && v0[1] === v1[1] && v0[2] === v1[2] && v0[3] === v1[3];
  },
  
  floatPrecision: function (v0, precision) {
    return [floatPrecision(v0[0], precision), floatPrecision(v0[1], precision), floatPrecision(v0[2], precision), floatPrecision(v0[3], precision)];
  }
};