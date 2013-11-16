// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var Quaternion = {
  create: Vec4.create,
  createFromArray: Vec4.createFromArray,
  createFromValues: Vec4.createFromValues,
  clone: Vec4.clone,
  setFromValues: Vec4.setFromValues,
  setFromArray: Vec4.setFromArray,
  add: Vec4.add,
  negate: Vec4.negate,
  scale: Vec4.scale,
  magnitudeSquared: Vec4.magnitudeSquared,
  magnitude: Vec4.magnitude,
  normalize: Vec4.normalize,
  dot: Vec4.dot,
  nlerp: Vec4.lerp,
  
  fromAxisAngle: function (axis, angle, out) {
    var normalizedAxis = [];
    var halfAngle = toRad(angle) / 2;
    var cosVal = Math.cos(halfAngle);
    var sinVal = Math.sin(halfAngle);
    
    Vec3.normalize(axis, normalizedAxis);
    
    this.setFromValues(out, normalizedAxis[0] * sinVal, normalizedAxis[1] * sinVal, normalizedAxis[2] * sinVal, cosVal);
    
    return out;
  },
  
  toAxisAngle: function (q0, out) {
    var scale = Math.sqrt(q0[0] * q0[0] + q0[1] * q0[1] + q0[2] * q0[2]);
    
    out[0] = q0[0] / scale;
    out[1] = q0[1] / scale;
    out[2] = q0[2] / scale;
    out[3] = Math.acos(q0[3]) * 2;
    
    return out;
  },
  
  fromEulerAngles: function (pitch, yaw, roll, out) {
    var p = toRad(pitch) / 2;
    var y = toRad(yaw) / 2;
    var r = toRad(roll) / 2;
    var sinp = Math.sin(p);
    var siny = Math.sin(y);
    var sinr = Math.sin(r);
    var cosp = Math.cos(p);
    var cosy = Math.cos(y);
    var cosr = Math.cos(r);
    
    this.setFromValues(out,
      sinr * cosp * cosy - cosr * sinp * siny,
      cosr * sinp * cosy + sinr * cosp * siny,
      cosr * cosp * siny - sinr * sinp * cosy,
      cosr * cosp * cosy + sinr * sinp * siny);
    
    this.normalize(out, out);
    
    return out;
  },
  
  fromAngles: function (x, y, z, out) {
    return this.fromEulerAngles(y, z, x, out);
  },
  
  conjugate: function (q0, out) {
    out[0] = -q0[0];
    out[1] = -q0[1];
    out[2] = -q0[2];
    out[3] = q0[3];
    
    return out;
  },

  concat: function (q0, q1, out) {
    var x0 = q0[0], y0 = q0[1], z0 = q0[2], w0 = q0[3];
    var x1 = q1[0], y1 = q1[1], z1 = q1[2], w1 = q1[3];
    
    out[0] = w0 * x1 + x0 * w1 + y0 * z1 - z0 * y1;
    out[1] = w0 * y1 - x0 * z1 + y0 * w1 + z0 * x1;
    out[2] = w0 * z1 + x0 * y1 - y0 * x1 + z0 * w1;
    out[3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
  },

  fromRotationMatrix4: function (m0, out) {
    var sx = m0[0], sy = m0[5], sz = m0[10];
    var x = Math.sqrt(Math.max(0, 1 - sx + sy - sz)) / 2;
    var y = Math.sqrt(Math.max(0, 1 - sx - sy + sz)) / 2;
    var z = Math.sqrt(Math.max(0, 1 + sx + sy + sz)) / 2;
    
    out[0] = Math.sqrt(Math.max(0, 1 + sx - sy - sz)) / 2;
    out[0] = math.copysign(x, m0[0] - m0[6]);
    out[1] = math.copysign(y, m0[2] - m0[8]);
    out[2] = math.copysign(z, m0[4] - m0[1]);
    
    return out;
  },
  
  toRotationMatrix4: function (q0, out) {
    var x = q0[0], y = q0[1], z = q0[2], w = q0[3];
    var x2 = 2 * x, y2 = 2 * y, z2 = 2 * z;
    var wx = x2 * w;
    var wy = y2 * w;
    var wz = z2 * w;
    var xx = x2 * x;
    var xy = y2 * x;
    var xz = z2 * x;
    var yy = y2 * y;
    var yz = z2 * y;
    var zz = z2 * z;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    
    return out;
  },
  
  multVec3: function (q0, v0, out) {
    var v = [];
    
    Vec3.normalize(v0, v);
    
    v[3] = 0;
    
    var conjugate = [];
    
    Quaternion.conjugate(q0, conjugate);
    
    Quaternion.concat(v, conjugate, v);
    
    Quaternion.concat(q0, v, v);
    
    var magnitude = Vec3.magnitude(v0);
    
    Vec3.setFromValues(out, v[0], v[1], v[2]);
    
    Vec3.scale(out, magnitude, out);
    
    return out;
  },
  
  slerp: function (q0, q1, t, out) {
    if (t < 0) {
      this.setFromArray(out, q0);
      return out;
    }
    
    if (t > 1) {
      this.setFromArray(out, q1);
      return out;
    }
    
    var cosVal = this.dot(q0, q1);
    
    if (cosVal > 1 || cosVal < -1) {
      this.setFromArray(out, q1);
      return out;
    }
    
    var factor = 1;
    
    if (cosVal < 0) {
      factor = -1;
      cosVal = -cosVal;
    }

    var angle = Math.acos(cosVal);
    
    if (angle <= EPSILON) {
      this.setFromArray(out, q1);
      return out;
    }
    
    var invSinVal = 1 / Math.sin(angle);
    var c0 = Math.sin((1 - t) * angle) * invSinVal;
    var c1 = factor * Math.sin(t * angle) * invSinVal;

    out[0] = q0[0] * c0 + q1[0] * c1;
    out[1] = q0[1] * c0 + q1[1] * c1;
    out[2] = q0[2] * c0 + q1[2] * c1;
    out[3] = q0[3] * c0 + q1[3] * c1;
    
    return out;
  },

  sqlerp: function (q0, q1, q2, q3, t, out) {
    var temp0 = [];
    var temp1 = [];
    
    this.slerp(q0, q3, t, temp0);
    this.slerp(q1, q2, t, temp1);
    this.slerp(temp0, temp1, 2 * t * (1 - t), out);
    
    return out;
  }
};