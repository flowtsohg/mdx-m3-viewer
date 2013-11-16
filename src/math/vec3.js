// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var Vec3 = {
  setFromValues: function (v0, x, y, z) {
    v0[0] = x;
    v0[1] = y;
    v0[2] = z;
  },

  setFromArray: function (v0, a) {
    v0[0] = a[0];
    v0[1] = a[1];
    v0[2] = a[2];
  },

  add: function (v0, v1, out) {
    out[0] = v0[0] + v1[0];
    out[1] = v0[1] + v1[1];
    out[2] = v0[2] + v1[2];
    
    return out;
  },

  subtract: function (v0, v1, out) {
    out[0] = v0[0] - v1[0];
    out[1] = v0[1] - v1[1];
    out[2] = v0[2] - v1[2];
    
    return out;
  },

  negate: function (v0, out) {
    out[0] = -v0[0];
    out[1] = -v0[1];
    out[2] = -v0[2];
    
    return out;
  },

  scale: function (v0, scalar, out) {
    out[0] = v0[0] * scalar;
    out[1] = v0[1] * scalar;
    out[2] = v0[2] * scalar;
    
    return out;
  },

  magnitudeSquared: function (v0) {
    var x = v0[0], y = v0[1], z = v0[2];
    
    return (x * x + y * y + z * z);
  },

  magnitude: function (v0) {
    var x = v0[0], y = v0[1], z = v0[2];
    
    return Math.sqrt(x * x + y * y + z * z);
  },

  normalize: function (v0, out) {
    var l = 1 / this.magnitude(v0);
    
    out[0] = v0[0] * l;
    out[1] = v0[1] * l;
    out[2] = v0[2] * l;
    
    return out;
  },

  dot: function (v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
  },

  cross: function (v0, v1, out) {
    var x0 = v0[0], y0 = v0[1], z0 = v0[2];
    var x1 = v1[0], y1 = v1[1], z1 = v1[2];
    
    out[0] = y0 * z1 - z0 * y1;
    out[1] = z0 * x1 - x0 * z1;
    out[2] = x0 * y1 - y0 * x1;
    
    return out;
  },

  lerp: function (v0, v1, t, out) {
    var x = v0[0], y = v0[1], z = v0[2];
    
    out[0] = (v1[0] - x) * t + x;
    out[1] = (v1[1] - y) * t + y;
    out[2] = (v1[2] - z) * t + z;
    
    return out;
  },
  
  hermite: function (a, outTan, inTan, b, t, out) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    var v1 = this.scale(a, factor1, []);
    var v2 = this.scale(outTan, factor2, []);
    var v3 = this.scale(inTan, factor3, []);
    var v4 = this.scale(b, factor4, []);
    
    out[0] = v1[0] + v2[0] + v3[0] + v4[0];
    out[1] = v1[1] + v2[1] + v3[1] + v4[1];
    out[2] = v1[2] + v2[2] + v3[2] + v4[2];
    
    return out;
  },

  bezier: function (a, outTan, inTan, b, t, out) {
    var invt = 1 - t;
    var factorTimes2 = t * t;
    var inverseFactorTimesTwo = invt * invt;
    var factor1 = inverseFactorTimesTwo * invt;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * invt;
    var factor4 = factorTimes2 * t;
    var v1 = this.scale(a, factor1, []);
    var v2 = this.scale(outTan, factor2, []);
    var v3 = this.scale(inTan, factor3, []);
    var v4 = this.scale(b, factor4, []);
    
    out[0] = v1[0] + v2[0] + v3[0] + v4[0];
    out[1] = v1[1] + v2[1] + v3[1] + v4[1];
    out[2] = v1[2] + v2[2] + v3[2] + v4[2];
    
    return out;
  },
  
  equals: function (v0, v1) {
    return v0.length === v1.length && v0[0] === v1[0] && v0[1] === v1[1] && v0[2] === v1[2];
  }
};