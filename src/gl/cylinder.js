function Cylinder(x, y, z, r, h, bands) {
  var i, l;
  var step = Math.PI * 2 / bands;
  var offset = 0;

  var buffer = ctx["createBuffer"]();
  var data = new Float32Array(72 * bands);
  
  for (i = 0, l = bands; i < l; i++) {
    var c = Math.cos(step * i) * r;
    var s = Math.sin(step * i) * r;
    var c2 = Math.cos(step * (i + 1)) * r;
    var s2 = Math.sin(step * (i + 1)) * r;
    var index = i * 72;

    // Top band
    data[index + 0] = 0;
    data[index + 1] = 0;
    data[index + 2] = h;
    data[index + 3] = c;
    data[index + 4] = s;
    data[index + 5] = h;

    data[index + 6] = 0;
    data[index + 7] = 0;
    data[index + 8] = h;
    data[index + 9] = c2;
    data[index + 10] = s2;
    data[index + 11] = h;

    data[index + 12] = c;
    data[index + 13] = s;
    data[index + 14] = h;
    data[index + 15] = c2;
    data[index + 16] = s2;
    data[index + 17] = h;

    // Bottom band
    data[index + 18] = 0;
    data[index + 19] = 0;
    data[index + 20] = -h;
    data[index + 21] = c;
    data[index + 22] = s;
    data[index + 23] = -h;

    data[index + 24] = 0;
    data[index + 25] = 0;
    data[index + 26] = -h;
    data[index + 27] = c2;
    data[index + 28] = s2;
    data[index + 29] = -h;

    data[index + 30] = c;
    data[index + 31] = s;
    data[index + 32] = -h;
    data[index + 33] = c2;
    data[index + 34] = s2;
    data[index + 35] = -h;

    // Side left-bottom band
    data[index + 36] = c;
    data[index + 37] = s;
    data[index + 38] = h;
    data[index + 39] = c;
    data[index + 40] = s;
    data[index + 41] = -h;

    data[index + 42] = c;
    data[index + 43] = s;
    data[index + 44] = h;
    data[index + 45] = c2;
    data[index + 46] = s2;
    data[index + 47] = -h;

    data[index + 48] = c;
    data[index + 49] = s;
    data[index + 50] = -h;
    data[index + 51] = c2;
    data[index + 52] = s2;
    data[index + 53] = -h;

    // Side right-top band
    data[index + 54] = c2;
    data[index + 55] = s2;
    data[index + 56] = -h;
    data[index + 57] = c;
    data[index + 58] = s;
    data[index + 59] = h;

    data[index + 60] = c2;
    data[index + 61] = s2;
    data[index + 62] = -h;
    data[index + 63] = c2;
    data[index + 64] = s2;
    data[index + 65] = h;

    data[index + 66] = c;
    data[index + 67] = s;
    data[index + 68] = h;
    data[index + 69] = c2;
    data[index + 70] = s2;
    data[index + 71] = h;
  }

  ctx["bindBuffer"](ctx["ARRAY_BUFFER"], buffer);
  ctx["bufferData"](ctx["ARRAY_BUFFER"], data, ctx["STATIC_DRAW"]);

  this.buffer = buffer;
  this.data = data;
  this.bands = bands;
}

Cylinder.prototype = {
  renderLines: function (shader) {
    if (boundShader) {
      ctx["bindBuffer"](ctx["ARRAY_BUFFER"], this.buffer);

      ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 12, 0);

      ctx["drawArrays"](ctx["LINES"], 0, this.bands * 24);
    }
  }
};