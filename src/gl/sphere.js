function Sphere(x, y, z, latitudeBands, longitudeBands, radius) {
  var vertexData = [];
  var indexData = [];
  var latNumber;
  var longNumber;
  
  for (latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    var theta = latNumber * Math.PI / latitudeBands;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      var phi = longNumber * 2 * Math.PI / longitudeBands;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var vx = cosPhi * sinTheta;
      var vy = cosTheta;
      var vz = sinPhi * sinTheta;
      var s = 1 - (longNumber / longitudeBands);
      var t = latNumber / latitudeBands;

      // Position
      vertexData.push(x + vx * radius);
      vertexData.push(y + vy * radius);
      vertexData.push(z + vz * radius);
      // Normal
      //vertexData.push(x);
      //vertexData.push(y);
      //vertexData.push(z);
      // Texture coordinate
      vertexData.push(s);
      vertexData.push(t);
    }
  }

  for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
    for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
      var first = (latNumber * (longitudeBands + 1)) + longNumber;
      var second = first + longitudeBands + 1;
      
      // First triangle
      indexData.push(first);
      indexData.push(second);
      indexData.push(first + 1);
      // Second triangle
      indexData.push(second);
      indexData.push(second + 1);
      indexData.push(first + 1);
    }
  }
  
  this.vertexArray = new Float32Array(vertexData);
  this.indexArray = new Uint16Array(indexData);
  
  this.vertexBuffer = gl["createBuffer"]();
  this.indexBuffer = gl["createBuffer"]();
  
  gl["bindBuffer"](gl["ARRAY_BUFFER"], this.vertexBuffer);
  gl["bufferData"](gl["ARRAY_BUFFER"], this.vertexArray, gl["STATIC_DRAW"]);
  
  gl["bindBuffer"](gl["ELEMENT_ARRAY_BUFFER"], this.indexBuffer);
  gl["bufferData"](gl["ELEMENT_ARRAY_BUFFER"], this.indexArray, gl["STATIC_DRAW"]);
}

Sphere.prototype = {
  render: function (shader) {
    gl["bindBuffer"](gl["ARRAY_BUFFER"], this.vertexBuffer);
    
    gl.vertexAttribPointer(shader.variables.a_position, 3, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(shader.variables.a_uv, 2, gl.FLOAT, false, 20, 12);
    //vertexAttribPointer("a_position", 3, gl["FLOAT"], false, 20, 0);
    //vertexAttribPointer("a_uv", 2, gl["FLOAT"], false, 20, 12);
    
    gl["bindBuffer"](gl["ELEMENT_ARRAY_BUFFER"], this.indexBuffer);
    
    gl["drawElements"](gl["TRIANGLES"], this.indexArray.length, gl["UNSIGNED_SHORT"], 0);
  },
  
  renderLines: function (shader) {
    gl["bindBuffer"](gl["ARRAY_BUFFER"], this.vertexBuffer);
    
    gl.vertexAttribPointer(shader.variables.a_position, 3, gl.FLOAT, false, 20, 0);
    //vertexAttribPointer("a_position", 3, gl["FLOAT"], false, 20, 0);
    
    gl["bindBuffer"](gl["ELEMENT_ARRAY_BUFFER"], this.indexBuffer);
    
    gl["drawElements"](gl["LINES"], this.indexArray.length, gl["UNSIGNED_SHORT"], 0);
  }
};