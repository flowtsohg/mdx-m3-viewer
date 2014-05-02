var interpolator = (function () {
  var zeroV = vec3.create();
  var zeroQ = quat.create();
    
  function scalar(a, b, c, d, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return math.lerp(a, d, t);
    } else if (type === 2) {
      return math.hermite(a, b, c, d, t);
    } else if (type === 3) {
      return math.bezier(a, b, c, d, t);
    }
    
    return 0;
  }
  
  function vector(out, a, b, c, d, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return vec3.lerp(out, a, d, t);
    } else if (type === 2) {
      return vec3.hermite(out, a, b, c, d, t);
    } else if (type === 3) {
      return vec3.bezier(out, a, b, c, d, t);
    }
    
    return zeroV;
	}
  
  function quaternion(out, a, b, c, d, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return quat.slerp(out, a, d, t);
    } else if (type === 2 || type === 3) {
      return quat.sqlerp(out, a, b, c, d, t);
    }
    
    return zeroQ;
  }
  
  return function (out, a, b, c, d, t, type) {
    var length = a.length;
    
    if (length === 3) {
      return vector(out, a, b, c, d, t, type);
    } else if (length === 4) {
      return quaternion(out, a, b, c, d, t, type);
    } else {
      return scalar(a, b, c, d, t, type);
    }
  }
}());