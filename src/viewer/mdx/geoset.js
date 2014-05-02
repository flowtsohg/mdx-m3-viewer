function Geoset(geoset) {
  var i, l, j, k;
  var positions = geoset.vertexPositions;
  //var normals = new Float32Array(geoset.vertexNormals);
  
  var textureCoordinateSets = geoset.textureCoordinateSets;
  var sets = textureCoordinateSets.length;
  var uvSetSize = textureCoordinateSets[0].length * 2;
  
  var uvs = new Float32Array(sets * uvSetSize);
  
  for (i = 0, l = geoset.textureCoordinateSets.length; i < l; i++) {
    uvs.set(textureCoordinateSets[i], i * uvSetSize);
  }
  
  var boneIndices = new Uint8Array(geoset.vertexPositions.length * 4);
  var boneNumbers = new Uint8Array(geoset.vertexPositions.length);
  var faces = new Uint16Array(geoset.faces);
  var matrixGroups = [];
  
  this.uvSetSize = uvSetSize * 4;
  
  for (i = 0, l = geoset.matrixGroups.length, k = 0; i < l; i++) {
    matrixGroups.push(geoset.matrixIndexes.subarray(k, k + geoset.matrixGroups[i]));
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
  
  var bufferSize = this.offsets[4];
  var arrayBuffer = ctx.createBuffer();
  
  ctx.bindBuffer(ctx.ARRAY_BUFFER, arrayBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER,  bufferSize, ctx.STATIC_DRAW);
  ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[0], positions);
  //ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[1], normals);
  ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[1], uvs);
  ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[2], boneIndices);
  ctx.bufferSubData(ctx.ARRAY_BUFFER, this.offsets[3], boneNumbers);
  
  var elementBuffer = ctx.createBuffer();
  
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, elementBuffer);
  ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, faces, ctx.STATIC_DRAW);
  
  this.arrayBuffer = arrayBuffer;
  this.elementBuffer = elementBuffer;
  this.elements = faces.length;
}

Geoset.prototype = {
  render: function (coordId, shader) {
    var offsets = this.offsets;
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
    
    ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 12, offsets[0]);
    ctx.vertexAttribPointer(shader.variables.a_uv, 2, ctx.FLOAT, false, 8, offsets[1] + coordId * this.uvSetSize);
    ctx.vertexAttribPointer(shader.variables.a_bones, 4, ctx.UNSIGNED_BYTE, false, 4, offsets[2]);
    ctx.vertexAttribPointer(shader.variables.a_bone_number, 1, ctx.UNSIGNED_BYTE, false, 1, offsets[3]);
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
    ctx.drawElements(ctx.TRIANGLES, this.elements, ctx.UNSIGNED_SHORT, 0);
  },
  
  renderColor: function (shader) {
    var offsets = this.offsets;
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
    
    ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 12, offsets[0]);
    ctx.vertexAttribPointer(shader.variables.a_bones, 4, ctx.UNSIGNED_BYTE, false, 4, offsets[2]);
    ctx.vertexAttribPointer(shader.variables.a_bone_number, 1, ctx.UNSIGNED_BYTE, false, 1, offsets[3]);
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
    ctx.drawElements(ctx.TRIANGLES, this.elements, ctx.UNSIGNED_SHORT, 0);
  }
};