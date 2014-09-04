var math = (function () {
  var math = {};
  var TORAD = Math.PI / 180;
  var TODEG = 180 / Math.PI;
  
  math.floatPrecision = function (number, decimals) {
    var multiplier = Math.pow(10, decimals);
    
    return Math.round(number * multiplier) / multiplier;
  };
  
  math.floatPrecisionArray = function (a, decimals) {
    var multiplier = Math.pow(10, decimals);
    var res = [];
    
    for (var i = 0, l = a.length; i < l; i++) {
      res[i] = Math.round(a[i] * multiplier) / multiplier;
    }
    
    return res;
  };

  math.random = function (a, b) {
    return a + Math.random() * (b - a);
  };

  math.clamp = function (x, minVal, maxVal) {
    return Math.min(Math.max(x, minVal), maxVal);
  };

  math.lerp = function (a, b, t) {
    return a + t * (b - a);
  };

  math.hermite = function (a, b, c, d, t) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    
    return (a * factor1) + (b * factor2) + (c * factor3) + (d * factor4);
  };

  math.bezier = function (a, b, c, d, t) {
    var invt = 1 - t;
    var factorTimes2 = t * t;
    var inverseFactorTimesTwo = invt * invt;
    var factor1 = inverseFactorTimesTwo * invt;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * invt;
    var factor4 = factorTimes2 * t;
    
    return (a * factor1) + (b * factor2) + (c * factor3) + (d * factor4);
  };

  math.toRad = function (degrees) {
    return degrees * TORAD;
  };

  math.toDeg = function (radians) {
    return radians * TODEG;
  };

  math.sign = function (x) {
    return x === 0 ? 0 : (x < 0 ? -1 : 1);
  };

  math.copysign = function (x, y) {
    var signy = sign(y);
    
    if (signy === 0) {
      return 0;
    }
    
    var signx = sign(x);
    
    if (signx !== signy) {
      return -x;
    }
    
    return x;
  };

  math.powerOfTwo = function (x) {
    x--;
    x |= x >> 1; 
    x |= x >> 2; 
    x |= x >> 4; 
    x |= x >> 8; 
    x |= x >> 16; 
    x++;
    
    return x;
  };

  return math;
}());