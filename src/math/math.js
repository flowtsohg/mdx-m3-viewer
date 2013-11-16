// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var EPSILON = 1e-6;
var TORAD = Math.PI / 180;
var TODEG = 180 / Math.PI;

function random(a, b) {
  return a + Math.random() * (b - a);
}

function clamp(x, minVal, maxVal) {
  return Math.min(Math.max(x, minVal), maxVal);
}

function lerp(a, b, t) {
  return a + t * (b - a);
}

function hermite(a, outTan, inTan, b, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  
  return (a * factor1) + (outTan * factor2) + (inTan * factor3) + (b * factor4);
}

function bezier(a, outTan, inTan, b, t) {
  var invt = 1 - t;
  var factorTimes2 = t * t;
  var inverseFactorTimesTwo = invt * invt;
  var factor1 = inverseFactorTimesTwo * invt;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * invt;
  var factor4 = factorTimes2 * t;
  
  return (a * factor1) + (outTan * factor2) + (inTan * factor3) + (b * factor4);
}

function toRad(degrees) {
  return degrees * TORAD;
}

function toDeg(radians) {
  return radians * TODEG;
}

function sign(x) {
  return x === 0 ? 0 : (x < 0 ? -1 : 1);
}

function copysign(x, y) {
  var signx = sign(x);
  var signy = sign(y);
  
  if (signy === 0) {
    return 0;
  }
  
  if (signx !== signy) {
    return -x;
  }
  
  return x;
}

function powerOfTwo(x) {
  x--;
  x |= x >> 1; 
  x |= x >> 2; 
  x |= x >> 4; 
  x |= x >> 8; 
  x |= x >> 16; 
  x++;
  
  return x;
}