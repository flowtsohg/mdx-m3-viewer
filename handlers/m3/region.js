function M3Region(region, triangles, elementArray, offset, gl) {
    let firstVertexIndex = region.firstVertexIndex,
        triangleIndicesCount = region.triangleIndicesCount,
        firstTriangleIndex = region.firstTriangleIndex;

    // Note for implementors: the one original vertex indices array could be used with access to the base-vertex draw elements function.
    // See https://www.opengl.org/sdk/docs/man3/xhtml/glDrawElementsBaseVertex.xml
    // firstTriangleIndex is the indices offset.
    // firstVertexIndex is the base vertex.
    for (let i = 0; i < triangleIndicesCount; i++) {
        elementArray[offset + i] = triangles[firstTriangleIndex + i] + firstVertexIndex;
    }

    this.gl = gl;
    this.firstBoneLookupIndex = region.firstBoneLookupIndex;
    this.boneWeightPairsCount = region.boneWeightPairsCount;
    this.offset = offset * 2;
    this.elements = triangleIndicesCount;
}

M3Region.prototype = {
    render(shader, instances) {
        let gl = this.gl;

        gl.uniform1f(shader.uniforms.get("u_firstBoneLookupIndex"), this.firstBoneLookupIndex);
        gl.uniform1f(shader.uniforms.get("u_boneWeightPairsCount"), this.boneWeightPairsCount);

        gl.extensions.instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.offset, instances);
    },
    
    getPolygonCount() {
        return this.elements / 3;
    }
};
