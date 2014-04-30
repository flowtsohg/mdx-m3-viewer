function Rect(x, y, z, hw, hh, stscale) {
  stscale = stscale || 1;
  
  this.buffer = gl["createBuffer"]();
  this.data = new Float32Array([
    x - hw, y - hh, z, 0, 1 * stscale,
    x + hw, y - hh, z, 1 * stscale, 1 * stscale,
    x - hw, y + hh, z, 0, 0,
    x + hw, y + hh, z, 1 * stscale, 0
  ]);
  
  gl["bindBuffer"](gl["ARRAY_BUFFER"], this.buffer);
  gl["bufferData"](gl["ARRAY_BUFFER"], this.data, gl["STATIC_DRAW"]);
}

Rect.prototype = {
  render: function (shader) {
    gl["bindBuffer"](gl["ARRAY_BUFFER"], this.buffer);
    
    gl.vertexAttribPointer(shader.variables.a_position, 3, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(shader.variables.a_uv, 2, gl.FLOAT, false, 20, 12);
    //vertexAttribPointer("a_position", 3, gl["FLOAT"], false, 20, 0);
    //vertexAttribPointer("a_uv", 2, gl["FLOAT"], false, 20, 12);
    
    gl["drawArrays"](gl["TRIANGLE_STRIP"], 0, 4);
  }
};