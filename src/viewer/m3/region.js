function Region(region, vertices, triangles, boneLookup, uvSetCount) {
  var i, j;
  var verticesCount = region.verticesCount;
  var firstVertexIndex = region.firstVertexIndex;
  var firstBoneLookupIndex = region.firstBoneLookupIndex;
  var triangleIndicesCount = region.triangleIndicesCount;
  var firstTriangleIndex = region.firstTriangleIndex;
  var elementsPerVertex = 19 + 2 * uvSetCount;
  var data = new Float32Array(elementsPerVertex * verticesCount);
  var faces = new Uint16Array(3 * triangleIndicesCount);
  
  for (i = 0; i < verticesCount; i++) {
    var k = i * elementsPerVertex;
    var vertex = vertices[firstVertexIndex + i];
    var position = vertex.position;
    var normal = vertex.normal;
    var uvs = vertex.uvs;
    var tangent = vertex.tangent;
    var boneLookupIndices = vertex.boneLookupIndices;
    var boneWeights = vertex.boneWeights;
    
    data[k + 0] = position[0];
    data[k + 1] = position[1];
    data[k + 2] = position[2];
    
    data[k + 3] = normal[0];
    data[k + 4] = normal[1];
    data[k + 5] = normal[2];
    data[k + 6] = normal[3];
    
    data[k + 7] = tangent[0];
    data[k + 8] = tangent[1];
    data[k + 9] = tangent[2];
    data[k + 10] = tangent[3];
    
    data[k + 11] = boneLookup[firstBoneLookupIndex + boneLookupIndices[0]];
    data[k + 12] = boneLookup[firstBoneLookupIndex + boneLookupIndices[1]];
    data[k + 13] = boneLookup[firstBoneLookupIndex + boneLookupIndices[2]];
    data[k + 14] = boneLookup[firstBoneLookupIndex + boneLookupIndices[3]];
    
    data[k + 15] = boneWeights[0];
    data[k + 16] = boneWeights[1];
    data[k + 17] = boneWeights[2];
    data[k + 18] = boneWeights[3];
    
    for (j = 0; j < uvSetCount; j++) {
      var uv = uvs[j];
      
      data[k + 19 + 2 * j] = uv[0]; // 72 + i * 4
      data[k + 20 + 2 * j] = uv[1]; // 76 + i * 4
    }
  }
  
  for (i = 0; i < triangleIndicesCount; i++) {
    faces[i] = triangles[firstTriangleIndex + i];
  }
  
  var dataBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, dataBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, data, ctx.STATIC_DRAW);
  
  var faceBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, faceBuffer);
  ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, faces, ctx.STATIC_DRAW);
  
  this.buffers = {
    data: dataBuffer,
    face: faceBuffer
  };
  
  this.uvSetCount = uvSetCount;
  this.triangleIndicesCount = triangleIndicesCount;
  // The size in bytes of every vertex
  this.vertexSize = elementsPerVertex * 4;
}

Region.prototype = {
  render: function () {
    var buffers = this.buffers;
    var uvSetCount = this.uvSetCount;
    var vertexSize = this.vertexSize;
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.data);
    
    gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, vertexSize, 0);
    gl.vertexAttribPointer("a_normal", 4, ctx.FLOAT, false, vertexSize, 12);
    gl.vertexAttribPointer("a_tangent", 4, ctx.FLOAT, false, vertexSize, 28);
    gl.vertexAttribPointer("a_bones", 4, ctx.FLOAT, false, vertexSize, 44);
    gl.vertexAttribPointer("a_weights", 4, ctx.FLOAT, false, vertexSize, 60);
    
    for (var i = 0; i < uvSetCount; i++) {
      gl.vertexAttribPointer("a_uv" + i, 2, ctx.FLOAT, false, vertexSize, 76 + i * 8);
    }
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffers.face);
    ctx.drawElements(ctx.TRIANGLES, this.triangleIndicesCount, ctx.UNSIGNED_SHORT, 0);
  },
  
  renderColor: function () {
    var buffers = this.buffers;
    var uvSetCount = this.uvSetCount;
    var vertexSize = this.vertexSize;
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.data);
    
    gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, vertexSize, 0);
    gl.vertexAttribPointer("a_bones", 4, ctx.FLOAT, false, vertexSize, 44);
    gl.vertexAttribPointer("a_weights", 4, ctx.FLOAT, false, vertexSize, 60);
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffers.face);
    ctx.drawElements(ctx.TRIANGLES, this.triangleIndicesCount, ctx.UNSIGNED_SHORT, 0);
  }
};