// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Geoset(geoset) {
  var i, l, j, k;
  var positions = new Float32Array(geoset.vertexPositions);
  //var normals = new Float32Array(geoset.vertexNormals);
  
  var textureCoordinateSets = geoset.textureCoordinateSets;
  var sets = textureCoordinateSets.length;
  var uvSetSize = textureCoordinateSets[0].length * 2;
  
  var uvs = new Float32Array(sets * uvSetSize);
  
  for (i = 0, l = geoset.textureCoordinateSets.length; i < l; i++) {
    uvs.set(textureCoordinateSets[i], i * uvSetSize);
  }
  
  var boneIndices = new Float32Array(geoset.vertexPositions.length * 4);
  var boneNumbers = new Float32Array(geoset.vertexPositions.length);
  var faces = new Uint16Array(geoset.faces);
  var matrixGroups = [];
  
  this.uvSetSize = uvSetSize * 4;
  
  for (i = 0, l = geoset.matrixGroups.length, k = 0; i < l; i++) {
    matrixGroups.push(geoset.matrixIndexes.slice(k, k + geoset.matrixGroups[i]));
    k += geoset.matrixGroups[i];
  }
  
  for (i = 0, l = positions.length / 3, k = 0; i < l; i++) {
    var matrixGroup = matrixGroups[geoset.vertexGroups[i]];
    var count = 0;
      
    // 1 is added to every index for shader optimization.
    for (j = 0; j < 4; j++) {
      if (matrixGroup && j < matrixGroup.length) {
        boneIndices[k] = matrixGroup[j] + 1;
        count += 1;
      } else {
        boneIndices[k] = 0;
      }
      
      k += 1;
    }
    
    boneNumbers[i] = count;
  }
  
  this.offsets = [0, positions.byteLength];
  //this.offsets[2] = this.offsets[1] + normals.byteLength;
  this.offsets[2] = this.offsets[1] + uvs.byteLength;
  this.offsets[3] = this.offsets[2] + boneIndices.byteLength;
  this.offsets[4] = this.offsets[3] + boneNumbers.byteLength;
  
  this.buffers = {
    vertices: ctx.createBuffer(),
    faces: ctx.createBuffer()
  };
  
  var bufferSize = this.offsets[4];
  
  if (RENDER_MODE === 0) {
    bufferSize = this.offsets[2];
    
    this.positions = positions;
    this.animatedPositions = new Float32Array(geoset.vertexPositions.length);
    this.boneNumbers = boneNumbers;
    this.boneIndices = boneIndices;
  }
  
  ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffers.vertices);
  ctx.bufferData(ctx.ARRAY_BUFFER,  bufferSize, ctx.STATIC_DRAW);
  ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[0], positions);
  //ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[1], normals);
  ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[1], uvs);
  
  if (RENDER_MODE > 0) {
    ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[2], boneIndices);
    ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[3], boneNumbers);
  }
  
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffers.faces);
  ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, faces, ctx.STATIC_DRAW);
  
  this.faces = faces.length;
}

Geoset.prototype = {
  render: function (nodes, coordId) {
    var v = [];
    var p = [];
    var positions = this.positions;
    var animatedPositions = this.animatedPositions;
    
    // Inlining all the vector and matrix operations here seems to make this faster, and speed is badly needed here
    for (var i = 0, l = positions.length / 3; i < l; i++) {
      v[0] = v[1] = v[2] = 0;
      p[0] = positions[i * 3 + 0];
      p[1] = positions[i * 3 + 1];
      p[2] = positions[i * 3 + 2];
      
      var boneNumber = this.boneNumbers[i];
      
      for (var j = 0, k = boneNumber; j < k; j++) {
        // -1 because we added 1 for hardware skinning
        var m0 = nodes[this.boneIndices[i * 4 + j] - 1].worldMatrix;
        var x = p[0], y = p[1], z = p[2];
        
        v[0] += x * m0[0] + y * m0[4] + z * m0[8] + m0[12];
        v[1] += x * m0[1] + y * m0[5] + z * m0[9] + m0[13];
        v[2] += x * m0[2] + y * m0[6] + z * m0[10] + m0[14];
      }
      
      var scale = 1 / boneNumber;
      
      animatedPositions[i * 3 + 0] = v[0] * scale;
      animatedPositions[i * 3 + 1] = v[1] * scale;
      animatedPositions[i * 3 + 2] = v[2] * scale;
    }
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffers.vertices);
    ctx.bufferSubData(ctx.ARRAY_BUFFER,  this.offsets[0], animatedPositions);
    
    gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, 12, this.offsets[0]);
    //gl.vertexAttribPointer("a_normal", 3, ctx.FLOAT, false, 12, this.offsets[1]);
    gl.vertexAttribPointer("a_uv", 2, ctx.FLOAT, false, 8, this.offsets[1] + coordId * this.uvSetSize);
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffers.faces);
    ctx.drawElements(ctx.TRIANGLES, this.faces, ctx.UNSIGNED_SHORT, 0);
  },
  
  renderHW: function (coordId) {
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffers.vertices);
    
    gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, 12, this.offsets[0]);
    //gl.vertexAttribPointer("a_normal", 3, ctx.FLOAT, false, 12, this.offsets[1]);
    gl.vertexAttribPointer("a_uv", 2, ctx.FLOAT, false, 8, this.offsets[1] + coordId * this.uvSetSize);
    gl.vertexAttribPointer("a_bones", 4, ctx.FLOAT, false, 16, this.offsets[2]);
    gl.vertexAttribPointer("a_bone_number", 1, ctx.FLOAT, false, 4, this.offsets[3]);
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.buffers.faces);
    ctx.drawElements(ctx.TRIANGLES, this.faces, ctx.UNSIGNED_SHORT, 0);
  }
};