function Rect(x, y, z, hw, hh, stscale) {
  stscale = stscale || 1;
  
  this.buffer = ctx["createBuffer"]();
  this.data = new Float32Array([
    x - hw, y - hh, z, 0, 1 * stscale,
    x + hw, y - hh, z, 1 * stscale, 1 * stscale,
    x - hw, y + hh, z, 0, 0,
    x + hw, y + hh, z, 1 * stscale, 0
  ]);
  
  ctx["bindBuffer"](ctx["ARRAY_BUFFER"], this.buffer);
  ctx["bufferData"](ctx["ARRAY_BUFFER"], this.data, ctx["STATIC_DRAW"]);
}

Rect.prototype = {
  render: function (shader) {
    ctx["bindBuffer"](ctx["ARRAY_BUFFER"], this.buffer);
    
    ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 20, 0);
    ctx.vertexAttribPointer(shader.variables.a_uv, 2, ctx.FLOAT, false, 20, 12);
    
    ctx["drawArrays"](ctx["TRIANGLE_STRIP"], 0, 4);
  }
};