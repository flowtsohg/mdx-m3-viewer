function Region(region, triangles, elementArray, offset) {
  var i, j;
  var firstVertexIndex = region.firstVertexIndex;
  var triangleIndicesCount = region.triangleIndicesCount;
  var firstTriangleIndex = region.firstTriangleIndex;
  
  for (i = 0; i < triangleIndicesCount; i++) {
    elementArray[offset + i] = triangles[firstTriangleIndex + i] + firstVertexIndex;
  }
  
  this.firstBoneLookupIndex = region.firstBoneLookupIndex;
  this.offset = offset;
  this.elementsCount = triangleIndicesCount;
}

Region.prototype = {
  render: function (shader) {
    ctx.uniform1f(shader.variables.u_firstBoneLookupIndex, this.firstBoneLookupIndex);
    //gl.setParameter("u_firstBoneLookupIndex", this.firstBoneLookupIndex);
    
    ctx.drawElements(ctx.TRIANGLES, this.elementsCount, ctx.UNSIGNED_SHORT, this.offset * 2);
  }
};