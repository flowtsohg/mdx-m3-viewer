function Cube(x1, y1, z1, x2, y2, z2) {
  this.buffer = gl["createBuffer"]();
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
  
  gl["bindBuffer"](gl["ARRAY_BUFFER"], this.buffer);
  gl["bufferData"](gl["ARRAY_BUFFER"], this.data, gl["STATIC_DRAW"]);
}

Cube.prototype = {
  renderLines: function (shader) {
    if (boundShader) {
      gl["bindBuffer"](gl["ARRAY_BUFFER"], this.buffer);
      
      gl.vertexAttribPointer(shader.variables.a_position, 3, gl.FLOAT, false, 12, 0);
      //vertexAttribPointer("a_position", 3, gl["FLOAT"], false, 12, 0);
      
      gl["drawArrays"](gl["LINES"], 0, 24);
    }
  }
};
