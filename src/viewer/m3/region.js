function Region(region, triangles, elementArray, offset) {
  var i, j;
  var firstVertexIndex = region.firstVertexIndex;
  var triangleIndicesCount = region.triangleIndicesCount;
  var firstTriangleIndex = region.firstTriangleIndex;
  
  // Note for implementors: the one original vertex indices array could be used with access to the base-vertex draw elements function.
  // See https://www.opengl.org/sdk/docs/man3/xhtml/glDrawElementsBaseVertex.xml
  // firstTriangleIndex is the indices offset.
  // firstVertexIndex is the base vertex.
  for (i = 0; i < triangleIndicesCount; i++) {
    elementArray[offset + i] = triangles[firstTriangleIndex + i] + firstVertexIndex;
  }
  
  this.firstBoneLookupIndex = region.firstBoneLookupIndex;
  this.offset = offset * 2;
  this.elements = triangleIndicesCount;
}

Region.prototype = {
  render: function (shader) {
    ctx.uniform1f(shader.variables.u_firstBoneLookupIndex, this.firstBoneLookupIndex);
    
    ctx.drawElements(ctx.TRIANGLES, this.elements, ctx.UNSIGNED_SHORT, this.offset);
  }
};