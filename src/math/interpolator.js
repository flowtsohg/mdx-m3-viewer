var Interpolator = (function () {
  function scalar(a, outTan, inTan, b, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return math.lerp(a, b, t);
    } else if (type === 2) {
      return math.hermite(a, outTan, inTan, b, t);
    } else if (type === 3) {
      return math.bezier(a, outTan, inTan, b, t);
    }
    
    return 0;
  }
  
  function vector(a, outTan, inTan, b, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return math.vec3.lerp(a, b, t, []);
    } else if (type === 2) {
      return math.vec3.hermite(a, outTan, inTan, b, t, []);
    } else if (type === 3) {
      return math.vec3.bezier(a, outTan, inTan, b, t, []);
    }
    
    return [0, 0, 0];
	}
  
  function quaternion(a, outTan, inTan, b, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return math.quaternion.slerp(a, b, t, []);
    } else if (type === 2 || type === 3) {
      return math.quaternion.sqlerp(a, outTan, inTan, b, t, []);
    }
    
    return [0, 0, 0, 1];
  }
  
  return {
    scalar: scalar,
    vector: vector,
    quaternion: quaternion
  };
}());