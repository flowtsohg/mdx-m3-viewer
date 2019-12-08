import M3ParserRegion from '../../../parsers/m3/region';
import ShaderProgram from '../../gl/program';
import M3Model from './model';

/**
 * An M3 region.
 */
export default class M3Region {
  gl: WebGLRenderingContext;
  firstBoneLookupIndex: number;
  boneWeightPairsCount: number;
  offset: number;
  verticesCount: number;
  elements: number;

  constructor(model: M3Model, region: M3ParserRegion, triangles: Uint16Array, elementArray: Uint16Array, offset: number) {
    let firstVertexIndex = region.firstVertexIndex;
    let triangleIndicesCount = region.triangleIndicesCount;
    let firstTriangleIndex = region.firstTriangleIndex;

    // Note for implementors: the one original vertex indices array could be used with access to the base-vertex draw elements function.
    // See https://www.opengl.org/sdk/docs/man3/xhtml/glDrawElementsBaseVertex.xml
    // firstTriangleIndex is the indices offset.
    // firstVertexIndex is the base vertex.
    for (let i = 0; i < triangleIndicesCount; i++) {
      elementArray[offset + i] = triangles[firstTriangleIndex + i] + firstVertexIndex;
    }

    this.gl = model.viewer.gl;
    this.firstBoneLookupIndex = region.firstBoneLookupIndex;
    this.boneWeightPairsCount = region.boneWeightPairsCount;
    this.offset = offset * 2;
    this.verticesCount = region.verticesCount;
    this.elements = triangleIndicesCount;
  }

  render(shader: ShaderProgram) {
    let gl = this.gl;

    gl.uniform1f(shader.uniforms.u_firstBoneLookupIndex, this.firstBoneLookupIndex);
    gl.uniform1f(shader.uniforms.u_boneWeightPairsCount, this.boneWeightPairsCount);

    gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.offset);
  }
}
