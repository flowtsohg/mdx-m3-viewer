function Rect(x, y, z, hw, hh, stscale) {
  stscale = stscale || 1;
  
  this.originalSize = hw;
  this.originalStscale = stscale;
  this.x = x;
  this.y = y;
  this.z = z;
  
  this.buffer = ctx.createBuffer();
  this.data = new Float32Array(20);
  
  this.resize(hw, hh);
}

Rect.prototype = {
  render: function (shader) {
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
    
    ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 20, 0);
    ctx.vertexAttribPointer(shader.variables.a_uv, 2, ctx.FLOAT, false, 20, 12);
    
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
  },
  
  resize: function (hw, hh) {
    var diff = hw / this.originalSize;
    var stscale = this.originalStscale * diff;
    var data = this.data;
    var x = this.x;
    var y = this.y;
    var z = this.z;
    
    data[0] = x - hw;
    data[1] = y - hh;
    data[2] = z
    data[3] = 0;
    data[4] = stscale;
    
    data[5] = x + hw;
    data[6] = y - hh;
    data[7] = z;
    data[8] = stscale;
    data[9] = stscale;
    
    data[10] = x - hw;
    data[11] = y + hh;
    data[12] = z;
    data[13] = 0;
    data[14] = 0;
    
    data[15] = x + hw;
    data[16] = y + hh;
    data[17] = z;
    data[18] = stscale;
    data[19] = 0;
  
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, data, ctx.STATIC_DRAW);
  }
};