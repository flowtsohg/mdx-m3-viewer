// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var Mat4 = {
  create: function () {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  },
  
  createIdentity: function () {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },
  
  createFromArray: function (a) {
    var m0 = this.create();
      
    this.setFromArray(m0, a);
      
    return m0;
  },

  createFromValues: function (v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23, v33) {
    var m0 = this.create();
    
    this.setFromValues(m0, v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23, v33);

    return m0;
  },
  
  setFromValues: function (m0, v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23, v33) {
    m0[0] = v00;
    m0[1] = v10;
    m0[2] = v20;
    m0[3] = v30;
    m0[4] = v01;
    m0[5] = v11;
    m0[6] = v21;
    m0[7] = v31;
    m0[8] = v02;
    m0[9] = v12;
    m0[10] = v22;
    m0[11] = v32;
    m0[12] = v03;
    m0[13] = v13;
    m0[14] = v23;
    m0[15] = v33;
  },

  setFromArray: function (m0, a) {
    m0[0] = a[0];
    m0[1] = a[1];
    m0[2] = a[2];
    m0[3] = a[3];
    m0[4] = a[4];
    m0[5] = a[5];
    m0[6] = a[6];
    m0[7] = a[7];
    m0[8] = a[8];
    m0[9] = a[9];
    m0[10] = a[10];
    m0[11] = a[11];
    m0[12] = a[12];
    m0[13] = a[13];
    m0[14] = a[14];
    m0[15] = a[15];
  },
  
  setColumnValues: function (m0, c, v0, v1, v2, v3) {
    var i = c * 4;
    
    m0[i] = v0;
    m0[i + 1] = v1;
    m0[i + 2] = v2;
    m0[i + 3] = v3;
  },
  
  setColumn: function (m0, c, a) {
    var i = c * 4;
    
    m0[i] = a[0];
    m0[i + 1] = a[1];
    m0[i + 2] = a[2];
    m0[i + 3] = a[3];
  },

  setRowValues: function (m0, r, v0, v1, v2, v3) {
    m0[r] = v0;
    m0[r + 4] = v1;
    m0[r + 8] = v2;
    m0[r + 12] = v3;
  },

  setRow: function (m0, r, a) {
    m0[r] = a[0];
    m0[r + 4] = a[1];
    m0[r + 8] = a[2];
    m0[r + 12] = a[3];
  },

  setDiagonalValues: function (m0, v00, v11, v22, v33) {
    m0[0] = v00;
    m0[5] = v11;
    m0[10] = v22;
    m0[15] = v33;
  },
  
  getColumn: function (m0, column, out) {
    var i = column * 4;
    out[0] = m0[i];
    out[1] = m0[i + 1];
    out[2] = m0[i + 2];
    out[3] = m0[i + 3];
  },

  getRow: function (m0, row, out) {
    out[0] = m0[row];
    out[1] = m0[row + 4];
    out[2] = m0[row + 8];
    out[3] = m0[row + 12];
  },

  getElement: function (m0, row, column) {
    return m0[row + column * 4];
  },

  setElement: function (m0, row, column, value) {
    m0[row + column * 4] = value;
  },
  
  makeZero: function (m0) {
    m0[0] = 0;
    m0[1] = 0;
    m0[2] = 0;
    m0[3] = 0;
    m0[4] = 0;
    m0[5] = 0;
    m0[6] = 0;
    m0[7] = 0;
    m0[8] = 0;
    m0[9] = 0;
    m0[10] = 0;
    m0[11] = 0;
    m0[12] = 0;
    m0[13] = 0;
    m0[14] = 0;
    m0[15] = 0;
    
    return m0;
  },
  
  makeIdentity: function (m0) {
    m0[0] = 1;
    m0[1] = 0;
    m0[2] = 0;
    m0[3] = 0;
    m0[4] = 0;
    m0[5] = 1;
    m0[6] = 0;
    m0[7] = 0;
    m0[8] = 0;
    m0[9] = 0;
    m0[10] = 1;
    m0[11] = 0;
    m0[12] = 0;
    m0[13] = 0;
    m0[14] = 0;
    m0[15] = 1;
    
    return m0;
  },
  
  addMat: function (m0, m1, out) {
    out[0] = m0[0] + m1[0];
    out[1] = m0[1] + m1[1];
    out[2] = m0[2] + m1[2];
    out[3] = m0[3] + m1[3];
    out[4] = m0[4] + m1[4];
    out[5] = m0[5] + m1[5];
    out[6] = m0[6] + m1[6];
    out[7] = m0[7] + m1[7];
    out[8] = m0[8] + m1[8];
    out[9] = m0[9] + m1[9];
    out[10] = m0[10] + m1[10];
    out[11] = m0[11] + m1[11];
    out[12] = m0[12] + m1[12];
    out[13] = m0[13] + m1[13];
    out[14] = m0[14] + m1[14];
    out[15] = m0[15] + m1[15];
    
    return out;
  },

  subMat: function (m0, m1, out) {
    out[0] = m0[0] - m1[0];
    out[1] = m0[1] - m1[1];
    out[2] = m0[2] - m1[2];
    out[3] = m0[3] - m1[3];
    out[4] = m0[4] - m1[4];
    out[5] = m0[5] - m1[5];
    out[6] = m0[6] - m1[6];
    out[7] = m0[7] - m1[7];
    out[8] = m0[8] - m1[8];
    out[9] = m0[9] - m1[9];
    out[10] = m0[10] - m1[10];
    out[11] = m0[11] - m1[11];
    out[12] = m0[12] - m1[12];
    out[13] = m0[13] - m1[13];
    out[14] = m0[14] - m1[14];
    out[15] = m0[15] - m1[15];
    
    return out;
  },

  multScalar: function (mat, scalar, out) {
    out[0] = mat[0] * scalar;
    out[1] = mat[1] * scalar;
    out[2] = mat[2] * scalar;
    out[3] = mat[3] * scalar;
    out[4] = mat[4] * scalar;
    out[5] = mat[5] * scalar;
    out[6] = mat[6] * scalar;
    out[7] = mat[7] * scalar;
    out[8] = mat[8] * scalar;
    out[9] = mat[9] * scalar;
    out[10] = mat[10] * scalar;
    out[11] = mat[11] * scalar;
    out[12] = mat[12] * scalar;
    out[13] = mat[13] * scalar;
    out[14] = mat[14] * scalar;
    out[15] = mat[15] * scalar;
    
    return out;
  },
  
  multMat: function (m0, m1, out) {
    var a00 = m0[0], a10 = m0[1], a20 = m0[2], a30 = m0[3];
    var a01 = m0[4], a11 = m0[5], a21 = m0[6], a31 = m0[7];
    var a02 = m0[8], a12 = m0[9], a22 = m0[10], a32 = m0[11];
    var a03 = m0[12], a13 = m0[13], a23 = m0[14], a33 = m0[15];

    var b00 = m1[0], b10 = m1[1], b20 = m1[2], b30 = m1[3];
    var b01 = m1[4], b11 = m1[5], b21 = m1[6], b31 = m1[7];
    var b02 = m1[8], b12 = m1[9], b22 = m1[10], b32 = m1[11];
    var b03 = m1[12], b13 = m1[13], b23 = m1[14], b33 = m1[15];

    out[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    out[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    out[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    out[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;

    out[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    out[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    out[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    out[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;

    out[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    out[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    out[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;

    out[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    out[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    out[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
    
    return out;
  },
  
  transpose: function (m0, out) {
    if (out === m0) {
      var a10 = m0[1], a20 = m0[2], a30 = m0[3];
      var a21 = m0[6], a31 = m0[7];
      var a32 = m0[11];
      
      out[1] = m0[4];
      out[2] = m0[8];
      out[3] = m0[12];
      out[4] = a10;
      out[6] = m0[9];
      out[7] = m0[13];
      out[8] = a20;
      out[9] = a21;
      out[11] = m0[14];
      out[12] = a30;
      out[13] = a31;
      out[14] = a32;
    } else {
      out[0] = m0[0];
      out[1] = m0[4];
      out[2] = m0[8];
      out[3] = m0[12];

      out[4] = m0[1];
      out[5] = m0[5];
      out[6] = m0[9];
      out[7] = m0[13];

      out[8] = m0[2];
      out[9] = m0[6];
      out[10] = m0[10];
      out[11] = m0[14];

      out[12] = m0[3];
      out[13] = m0[7];
      out[14] = m0[11];
      out[15] = m0[15];
    }
    
    return out;
  },

  determinant: function (m0) {
    var m00 = m0[0], m10 = m0[1], m20 = m0[2], m30 = m0[3];
    var m01 = m0[4], m11 = m0[5], m21 = m0[6], m31 = m0[7];
    var m02 = m0[8], m12 = m0[9], m22 = m0[10], m32 = m0[11];
    var m03 = m0[12], m13 = m0[13], m23 = m0[14], m33 = m0[15];

    var a0 = m00 * m11 - m10 * m01;
    var a1 = m00 * m21 - m20 * m01;
    var a2 = m00 * m31 - m30 * m01;
    var a3 = m10 * m21 - m20 * m11;
    var a4 = m10 * m31 - m30 * m11;
    var a5 = m20 * m31 - m30 * m21;
    var b0 = m02 * m13 - m12 * m03;
    var b1 = m02 * m23 - m22 * m03;
    var b2 = m02 * m33 - m32 * m03;
    var b3 = m12 * m23 - m22 * m13;
    var b4 = m12 * m33 - m32 * m13;
    var b5 = m22 * m33 - m32 * m23;

    return (a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0);
  },
  
  invert: function (m0, out) {
    var m00 = m0[0], m10 = m0[1], m20 = m0[2], m30 = m0[3];
    var m01 = m0[4], m11 = m0[5], m21 = m0[6], m31 = m0[7];
    var m02 = m0[8], m12 = m0[9], m22 = m0[10], m32 = m0[11];
    var m03 = m0[12], m13 = m0[13], m23 = m0[14], m33 = m0[15];

    var a0 = m00 * m11 - m10 * m01;
    var a1 = m00 * m21 - m20 * m01;
    var a2 = m00 * m31 - m30 * m01;
    var a3 = m10 * m21 - m20 * m11;
    var a4 = m10 * m31 - m30 * m11;
    var a5 = m20 * m31 - m30 * m21;
    var b0 = m02 * m13 - m12 * m03;
    var b1 = m02 * m23 - m22 * m03;
    var b2 = m02 * m33 - m32 * m03;
    var b3 = m12 * m23 - m22 * m13;
    var b4 = m12 * m33 - m32 * m13;
    var b5 = m22 * m33 - m32 * m23;

    var det = a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;
    
    if (det === 0) {
      return false;
    }

    var idet = 1 / det;
    
    out[0] = (m11 * b5 - m21 * b4 + m31 * b3) * idet;
    out[1] = (-m10 * b5 + m20 * b4 - m30 * b3) * idet;
    out[2] = (m13 * a5 - m23 * a4 + m33 * a3) * idet;
    out[3] = (-m12 * a5 + m22 * a4 - m32 * a3) * idet;
    out[4] = (-m01 * b5 + m21 * b2 - m31 * b1) * idet;
    out[5] = (m00 * b5 - m20 * b2 + m30 * b1) * idet;
    out[6] = (-m03 * a5 + m23 * a2 - m33 * a1) * idet;
    out[7] = (m02 * a5 - m22 * a2 + m32 * a1) * idet;
    out[8] = (m01 * b4 - m11 * b2 + m31 * b0) * idet;
    out[9] = (-m00 * b4 + m10 * b2 - m30 * b0) * idet;
    out[10] = (m03 * a4 - m13 * a2 + m33 * a0) * idet;
    out[11] = (-m02 * a4 + m12 * a2 - m32 * a0) * idet;
    out[12] = (-m01 * b3 + m11 * b1 - m21 * b0) * idet;
    out[13] = (m00 * b3 - m10 * b1 + m20 * b0) * idet;
    out[14] = (-m03 * a3 + m13 * a1 - m23 * a0) * idet;
    out[15] = (m02 * a3 - m12 * a1 + m22 * a0) * idet;
    
    return true;
  },
  
  equals: function (m0, m1) {
    return m0.length === m1.length && m0[0] === m1[0] && m0[1] === m1[1] && m0[2] === m1[2] && m0[3] === m1[3] && m0[4] === m1[4] && m0[5] === m1[5] && m0[6] === m1[6] && m0[7] === m1[7] && m0[8] === m1[8] && m0[9] === m1[9] && m0[10] === m1[10] && m0[11] === m1[11] && m0[12] === m1[12] && m0[13] === m1[13] && m0[14] === m1[14] && m0[15] === m1[15];
  },
  
  makeTranslate: function (m0, x, y, z) {
    this.makeIdentity(m0);
    this.setColumnValues(m0, 3, x, y, z, 1);
    
    return m0;
  },

  makeScale: function (m0, x, y, z) {
    this.makeIdentity(m0);
    this.setDiagonalValues(m0, x, y, z, 1);
    
    return m0;
  },

  makeRotate: function (m0, angle, ax, ay, az) {
    var c = Math.cos(angle);
    var d = 1 - c;
    var s = Math.sin(angle);

    this.setFromValues(m0, ax * ax * d + c, ax * ay * d + az * s, ax * az * d - ay * s, 0, ax * ay * d - az * s, ay * ay * d + c, ay * az * d + ax * s, 0, ax * az * d + ay * s, ay * az * d - ax * s, az * az * d + c, 0, 0, 0, 0, 1);
    
    return m0;
  },
  
  makeRotateX: function (m0, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    
    this.setFromValues(m0, 1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    
    return m0;
  },
  
  makeRotateY: function (m0, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    
    this.setFromValues(m0, c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    
    return m0;
  },
  
  makeRotateZ: function (m0, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    
    this.setFromValues(m0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    
    return m0;
  },
  
  makeFrustum: function (m0, left, right, bottom, top, near, far) {
    var x = (2 * near) / (right - left);
    var y = (2 * near) / (top - bottom);
    var a = (right + left) / (right - left);
    var b = (top + bottom) / (top - bottom);
    var c = -(far + near) / (far - near);
    var d = -(2 * far * near) / (far - near);

    this.setFromValues(m0, x, 0, 0, 0, 0, y, 0, 0, a, b, c, -1, 0, 0, d, 0);
    
    return m0;
  },
  
  makePerspective: function (m0, fovy, aspect, near, far) {
    var angle = fovy / 2;
    var dz = far - near;
    var sinAngle = Math.sin(angle);
    
    if (dz === 0 || sinAngle === 0 || aspect === 0) {
      return m0;
    }

    var cot = Math.cos(angle) / sinAngle;
    
    this.setFromValues(m0, cot / aspect, 0, 0, 0, 0, cot, 0, 0, 0, 0, -(far + near) / dz, -1, 0, 0, -(2 * near * far) / dz, 0);
    
    return m0;
  },
  
  makeOrtho: function (m0, left, right, bottom, top, near, far) {
    var x = 2 / (right - left);
    var y = 2 / (top - bottom);
    var z = -2 / (far - near);
    var a = -(right + left) / (right - left);
    var b = -(top + bottom) / (top - bottom);
    var c = -(far + near) / (far - near);

    this.setFromValues(m0, x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, a, b, c, 1);
    
    return m0;
  },
  
  makeLookAt: function (m0, eye, center, up) {
    var fwdVec = [];
    var sideVec = [];
    var upVec = [];
    
    Vec3.subtract(center, eye, fwdVec);
    Vec3.normalize(fwdVec, fwdVec);
    fwdVec[3] = 0;

    Vec3.cross(fwdVec, up, sideVec);
    Vec3.normalize(sideVec, sideVec);
    sideVec[3] = 0;
    
    Vec3.cross(sideVec, fwdVec, upVec);
    Vec3.normalize(upVec, upVec);
    upVec[3] = 0;

    Vec3.negate(fwdVec, fwdVec);
    
    this.setRow(m0, 0, sideVec);
    this.setRow(m0, 1, upVec);
    this.setRow(m0, 2, fwdVec);
    this.setRowValues(m0, 3, 0, 0, 0, 1);
    this.translate(m0, -eye[0], -eye[1], -eye[2]);

    return m0;
  },

  translate: function (m0, x, y, z) {
    this.setColumnValues( m0, 3, m0[0] * x + m0[4] * y + m0[8] * z + m0[12], m0[1] * x + m0[5] * y + m0[9] * z + m0[13], m0[2] * x + m0[6] * y + m0[10] * z + m0[14], m0[3] * x + m0[7] * y + m0[11] * z + m0[15]);
    
    return m0;
  },

  scale: function (m0, x, y, z) {
    this.setFromValues(m0, m0[0] * x, m0[1] * x, m0[2] * x, m0[3] * x, m0[4] * y, m0[5] * y, m0[6] * y, m0[7] * y, m0[8] * z, m0[9] * z, m0[10] * z, m0[11] * z, m0[12], m0[13], m0[14], m0[15]);
    
    return m0;
  },
  
  rotate: function (m0, angle, x, y, z) {
    var m00 = m0[0], m10 = m0[1], m20 = m0[2], m30 = m0[3];
    var m01 = m0[4], m11 = m0[5], m21 = m0[6], m31 = m0[7];
    var m02 = m0[8], m12 = m0[9], m22 = m0[10], m32 = m0[11];
    var m03 = m0[12], m13 = m0[13], m23 = m0[14], m33 = m0[15];

    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);
    var diffCosAngle = 1 - cosAngle;
    
    var r00 = x * x * diffCosAngle + cosAngle;
    var r10 = x * y * diffCosAngle + z * sinAngle;
    var r20 = x * z * diffCosAngle - y * sinAngle;

    var r01 = x * y * diffCosAngle - z * sinAngle;
    var r11 = y * y * diffCosAngle + cosAngle;
    var r21 = y * z * diffCosAngle + x * sinAngle;

    var r02 = x * z * diffCosAngle + y * sinAngle;
    var r12 = y * z * diffCosAngle - x * sinAngle;
    var r22 = z * z * diffCosAngle + cosAngle;

    this.setFromValues(m0, m00 * r00 + m01 * r10 + m02 * r20, m10 * r00 + m11 * r10 + m12 * r20, m20 * r00 + m21 * r10 + m22 * r20, m30 * r00 + m31 * r10 + m32 * r20, m00 * r01 + m01 * r11 + m02 * r21, m10 * r01 + m11 * r11 + m12 * r21, m20 * r01 + m21 * r11 + m22 * r21, m30 * r01 + m31 * r11 + m32 * r21, m00 * r02 + m01 * r12 + m02 * r22, m10 * r02 + m11 * r12 + m12 * r22, m20 * r02 + m21 * r12 + m22 * r22, m30 * r02 + m31 * r12 + m32 * r22, m03, m13, m23, m33);

    return m0;
  },
  
  rotateQ: function (m0, q0) {
    var m = [];
    
    math.quaternion.toRotationMatrix4(q0, m);
    
    math.mat4.multMat(m0, m, m0);
    
    return m0;
  },
  
  multVec3: function (m0, v0, out) {
    var x = v0[0], y = v0[1], z = v0[2];
    
    out[0] = x * m0[0] + y * m0[4] + z * m0[8] + m0[12];
    out[1] = x * m0[1] + y * m0[5] + z * m0[9] + m0[13];
    out[2] = x * m0[2] + y * m0[6] + z * m0[10] + m0[14];
    
    return out;
  },
  
  multVec4: function (m0, v0, out) {
    var x = v0[0], y = v0[1], z = v0[2], w = v0[3];
    
    out[0] = x * m0[0] + y * m0[4] + z * m0[8] + w * m0[12];
    out[1] = x * m0[1] + y * m0[5] + z * m0[9] + w * m0[13];
    out[2] = x * m0[2] + y * m0[6] + z * m0[10] + w * m0[14];
    out[3] = x * m0[3] + y * m0[7] + z * m0[11] + w * m0[15];
    
    return out;
  },
  
  decompose: function (m0, translationout, quaternionout, scaleout) {
    var m00 = m0[0], m10 = m0[1], m20 = m0[2];
    var m01 = m0[4], m11 = m0[5], m21 = m0[6];
    var m02 = m0[8], m12 = m0[9], m22 = m0[10];
    var m03 = m0[12], m13 = m0[13], m23 = m0[14];
    var m = [];
    var v = [];
    
    v[0] = m00;
    v[1] = m10;
    v[2] = m20;
    scaleout[0] = Vec3.magnitude(v);
    
    v[0] = m01;
    v[1] = m11;
    v[2] = m21;
    scaleout[1] = Vec3.magnitude(v);
    
    v[0] = m02;
    v[1] = m12;
    v[2] = m22;
    scaleout[2] = Vec3.magnitude(v);
    
    translationout[0] = m03;
    translationout[1] = m13;
    translationout[2] = m23;
    
    if (scaleout[0] === 0 || scaleout[1] === 0 || scaleout[2] === 0) {
      return false;
    }
    
    var invscale = [1 / scaleout[0], 1 / scaleout[1], 1 / scaleout[2]];
    
    this.setFromValues(m, m00 * invscale[0], m10 * invscale[0], m20 * invscale[0], 0, m01 * invscale[1], m11 * invscale[1], m21 * invscale[1], 0, m02 * invscale[2], m12 * invscale[2], m22 * invscale[2], 0, 0, 0, 0, 1);

    Quaternion.fromRotationMatrix4(m, quaternionout);
    
    return true;
  }
};