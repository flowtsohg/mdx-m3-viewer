// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Region(region, vertices, triangles, boneLookup, uvSetCount) {
  var i, j;
  var verticesCount = region.verticesCount;
  var firstVertexIndex = region.firstVertexIndex;
  var firstBoneLookupIndex = region.firstBoneLookupIndex;
  var triangleIndicesCount = region.triangleIndicesCount;
  var firstTriangleIndex = region.firstTriangleIndex;
  var positions = new Float32Array(3 * verticesCount);
  var normals = new Float32Array(4 * verticesCount);
  var uvs = new Float32Array(2 * verticesCount * uvSetCount);
  var tangents = new Float32Array(4 * verticesCount);
  var bones = new Uint16Array(4 * verticesCount);
  var weights = new Uint8Array(4 * verticesCount);
  var faces = new Uint16Array(3 * triangleIndicesCount);
  
  for (i = 0; i < verticesCount; i++) {
    var vertex = vertices[firstVertexIndex + i];
    var position = vertex.position;
    var normal = vertex.normal;
    var vuvs = vertex.uvs;
    var tangent = vertex.tangent;
    var boneLookupIndices = vertex.boneLookupIndices;
    var boneWeights = vertex.boneWeights;
    
    positions[i * 3 + 0] = position[0];
    positions[i * 3 + 1] = position[1];
    positions[i * 3 + 2] = position[2];
    
    normals[i * 4 + 0] = normal[0];
    normals[i * 4 + 1] = normal[1];
    normals[i * 4 + 2] = normal[2];
    normals[i * 4 + 3] = normal[3];
    
    for (j = 0; j < uvSetCount; j++) {
      var uv = vuvs[j];
      
      uvs[i * 2 * uvSetCount + j * 2 + 0] = uv[0];
      uvs[i * 2 * uvSetCount + j * 2 + 1] = uv[1];
    }
    
    tangents[i * 4 + 0] = tangent[0];
    tangents[i * 4 + 1] = tangent[1];
    tangents[i * 4 + 2] = tangent[2];
    tangents[i * 4 + 3] = tangent[3];
    
    bones[i * 4 + 0] = boneLookup[firstBoneLookupIndex + boneLookupIndices[0]];
    bones[i * 4 + 1] = boneLookup[firstBoneLookupIndex + boneLookupIndices[1]];
    bones[i * 4 + 2] = boneLookup[firstBoneLookupIndex + boneLookupIndices[2]];
    bones[i * 4 + 3] = boneLookup[firstBoneLookupIndex + boneLookupIndices[3]];
    
    weights[i * 4 + 0] = boneWeights[0];
    weights[i * 4 + 1] = boneWeights[1];
    weights[i * 4 + 2] = boneWeights[2];
    weights[i * 4 + 3] = boneWeights[3];
  }
  
  for (i = 0; i < triangleIndicesCount; i++) {
    faces[i] = triangles[firstTriangleIndex + i];
  }
  
  var positionBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, positions, ctx.STATIC_DRAW);
  
  var normalBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, normalBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, normals, ctx.STATIC_DRAW);
  
  var uvBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, uvBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, uvs, ctx.STATIC_DRAW);
  
  var tangentBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, tangentBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, tangents, ctx.STATIC_DRAW);
  
  var boneBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, boneBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, bones, ctx.STATIC_DRAW);
  
  var weightBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, weightBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, weights, ctx.STATIC_DRAW);
  
  var faceBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, faceBuffer);
  ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, faces, ctx.STATIC_DRAW);
  
  this.buffers = {
    position: positionBuffer,
    normal: normalBuffer,
    uv: uvBuffer,
    tangent: tangentBuffer,
    bone: boneBuffer,
    weight: weightBuffer,
    face: faceBuffer
  };
  
  this.uvSetCount = uvSetCount;
  this.triangleIndicesCount = triangleIndicesCount;
}

Region.prototype = {
  render: function () {
    var buffers = this.buffers;
    var uvSetCount = this.uvSetCount;
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, 0, 0);
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer("a_normal", 4, ctx.FLOAT, false, 0, 0);
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.uv);
    
    for (var i = 0; i < uvSetCount; i++) {
      gl.vertexAttribPointer("a_uv" + i, 2, ctx.FLOAT, false, uvSetCount * 8, i * 8);
    }
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.tangent);
    gl.vertexAttribPointer("a_tangent", 4, ctx.FLOAT, false, 0, 0);
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.bone);
    gl.vertexAttribPointer("a_bones", 4, ctx.UNSIGNED_SHORT, false, 0, 0);
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.weight);
    gl.vertexAttribPointer("a_weights", 4, ctx.UNSIGNED_BYTE, true, 0, 0);
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffers.face);
    ctx.drawElements(ctx.TRIANGLES, this.triangleIndicesCount, ctx.UNSIGNED_SHORT, 0);
  }
};