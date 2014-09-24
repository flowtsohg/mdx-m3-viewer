function Region(region, triangles, elementArray, edgeArray, offset) {
  var i, j, k;
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
  
  for (i = 0, k = 0; i < triangleIndicesCount; i += 3, k += 6) {
    edgeArray[offset * 2 + k + 0] = triangles[firstTriangleIndex + i + 0] + firstVertexIndex;
    edgeArray[offset * 2 + k + 1] = triangles[firstTriangleIndex + i + 1] + firstVertexIndex;
    edgeArray[offset * 2 + k + 2] = triangles[firstTriangleIndex + i + 1] + firstVertexIndex;
    edgeArray[offset * 2 + k + 3] = triangles[firstTriangleIndex + i + 2] + firstVertexIndex;
    edgeArray[offset * 2 + k + 4] = triangles[firstTriangleIndex + i + 2] + firstVertexIndex;
    edgeArray[offset * 2 + k + 5] = triangles[firstTriangleIndex + i + 0] + firstVertexIndex;
  }
  
  this.firstBoneLookupIndex = region.firstBoneLookupIndex;
  this.offset = offset * 2;
  this.elements = triangleIndicesCount;
}

Region.prototype = {
  render: function (shader, polygonMode) {
    ctx.uniform1f(shader.variables.u_firstBoneLookupIndex, this.firstBoneLookupIndex);
    
    if (polygonMode) {
      ctx.drawElements(ctx.TRIANGLES, this.elements, ctx.UNSIGNED_SHORT, this.offset);
    } else {
      ctx.drawElements(ctx.LINES, this.elements * 2, ctx.UNSIGNED_SHORT, this.offset * 2);
    }
  }
};