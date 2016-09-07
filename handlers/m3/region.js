function M3Region(region, triangles, elementArray, edgeArray, offset, gl) {
    const firstVertexIndex = region.firstVertexIndex,
        triangleIndicesCount = region.triangleIndicesCount,
        firstTriangleIndex = region.firstTriangleIndex;

    // Note for implementors: the one original vertex indices array could be used with access to the base-vertex draw elements function.
    // See https://www.opengl.org/sdk/docs/man3/xhtml/glDrawElementsBaseVertex.xml
    // firstTriangleIndex is the indices offset.
    // firstVertexIndex is the base vertex.
    for (let i = 0; i < triangleIndicesCount; i++) {
        elementArray[offset + i] = triangles[firstTriangleIndex + i] + firstVertexIndex;
    }

    for (let i = 0, k = 0; i < triangleIndicesCount; i += 3, k += 6) {
        edgeArray[offset * 2 + k + 0] = triangles[firstTriangleIndex + i + 0] + firstVertexIndex;
        edgeArray[offset * 2 + k + 1] = triangles[firstTriangleIndex + i + 1] + firstVertexIndex;
        edgeArray[offset * 2 + k + 2] = triangles[firstTriangleIndex + i + 1] + firstVertexIndex;
        edgeArray[offset * 2 + k + 3] = triangles[firstTriangleIndex + i + 2] + firstVertexIndex;
        edgeArray[offset * 2 + k + 4] = triangles[firstTriangleIndex + i + 2] + firstVertexIndex;
        edgeArray[offset * 2 + k + 5] = triangles[firstTriangleIndex + i + 0] + firstVertexIndex;
    }

    this.gl = gl;
    this.firstBoneLookupIndex = region.firstBoneLookupIndex;
    this.boneWeightPairsCount = region.boneWeightPairsCount;
    this.offset = offset * 2;
    this.elements = triangleIndicesCount;
}

M3Region.prototype = {
    render(shader, instances) {
        const gl = this.gl;

        gl.uniform1f(shader.uniforms.get("u_firstBoneLookupIndex"), this.firstBoneLookupIndex);
        gl.uniform1f(shader.uniforms.get("u_boneWeightPairsCount"), this.boneWeightPairsCount);

        gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.offset);
    },
    
    renderWireframe(shader) {
        const gl = this.gl;

        gl.uniform1f(shader.uniforms.gert("u_firstBoneLookupIndex"), this.firstBoneLookupIndex);
        
        gl.drawElements(gl.LINES, this.elements * 2, gl.UNSIGNED_SHORT, this.offset * 2);
    },
    
    getPolygonCount() {
        return this.elements / 3;
    }
};
