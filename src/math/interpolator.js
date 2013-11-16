// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var Interpolator = (function () {
  function scalar(a, outTan, inTan, b, t, type) {
    switch (type) {
      case 0:
        return a;
      case 1:
        return math.lerp(a, b, t);
      case 2:
        return math.hermite(a, outTan, inTan, b, t);
      case 3:
        return math.bezier(a, outTan, inTan, b, t);
		}
  }
  
  function vector(a, outTan, inTan, b, t, type) {
		switch (type) {
      case 0:
        return a;
      case 1:
        return math.vec3.lerp(a, b, t, []);
      case 2:
        return math.vec3.hermite(a, outTan, inTan, b, t, []);
      case 3:
        return math.vec3.bezier(a, outTan, inTan, b, t, []);
		}
	}
  
  function quaternion(a, outTan, inTan, b, t, type) {
		switch (type) {
      case 0:
        return a;
      case 1:
        return math.quaternion.slerp(a, b, t, []);
      case 2:
      case 3:
        return math.quaternion.sqlerp(a, outTan, inTan, b, t, []);
    }
  }
  
  return {
    scalar: scalar,
    vector: vector,
    quaternion: quaternion
  };
}());