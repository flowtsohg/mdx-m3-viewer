function Cube(x1, y1, z1, x2, y2, z2) {
  this.buffer = ctx.createBuffer();
  this.data = new Float32Array([
    x1, y2, z1,
    x1, y2, z2,
    x1, y2, z2,
    x2, y2, z2,
    x2, y2, z2,
    x2, y2, z1,
    x2, y2, z1,
    x1, y2, z1,
    x1, y1, z1,
    x1, y1, z2,
    x1, y1, z2,
    x2, y1, z2,
    x2, y1, z2,
    x2, y1, z1,
    x2, y1, z1,
    x1, y1, z1,
    x1, y1, z2,
    x1, y2, z2,
    x1, y2, z1,
    x1, y1, z1,
    x2, y1, z2,
    x2, y2, z2,
    x2, y2, z1,
    x2, y1, z1
  ]);
  
  ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, this.data, ctx.STATIC_DRAW);
}

Cube.prototype = {
  renderLines: function (shader) {
    if (boundShader) {
      ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
      
      ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 12, 0);
      
      ctx.drawArrays(ctx.LINES, 0, 24);
    }
  }
};
