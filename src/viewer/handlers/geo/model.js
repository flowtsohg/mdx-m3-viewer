import Model from '../../model';

/**
 * A geometry model.
 *
 * Used to render simple geometric shapes.
 */
export default class GeometryModel extends Model {
  /**
   * Load the model.
   *
   * @param {Object} src
   */
  load(src) {
    const gl = this.viewer.gl;

    let geometry = src.geometry;
    let material = src.material;

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.uvs, gl.STATIC_DRAW);

    let faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.faces, gl.STATIC_DRAW);

    let edgeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.edges, gl.STATIC_DRAW);

    this.boundingRadius = geometry.boundingRadius;

    this.vertexArray = geometry.vertices;
    this.uvArray = geometry.uvs;
    this.faceArray = geometry.faces;
    this.edgeArray = geometry.edges;
    this.vertexBuffer = vertexBuffer;
    this.uvBuffer = uvBuffer;
    this.faceBuffer = faceBuffer;
    this.edgeBuffer = edgeBuffer;

    let bytesPerElement = geometry.faces.BYTES_PER_ELEMENT;

    if (bytesPerElement === 1) {
      this.faceIndexType = gl.UNSIGNED_BYTE;
    } else if (bytesPerElement === 2) {
      this.faceIndexType = gl.UNSIGNED_SHORT;
    } else {
      this.faceIndexType = gl.UNSIGNED_INT;
    }

    bytesPerElement = geometry.edges.BYTES_PER_ELEMENT;

    if (bytesPerElement === 1) {
      this.edgeIndexType = gl.UNSIGNED_BYTE;
    } else if (bytesPerElement === 2) {
      this.edgeIndexType = gl.UNSIGNED_SHORT;
    } else {
      this.edgeIndexType = gl.UNSIGNED_INT;
    }

    this.texture = material.texture || null;
    this.twoSided = material.twoSided || false;
    this.faceColor = material.faceColor || new Uint8Array([255, 255, 255]);
    this.edgeColor = material.edgeColor || new Uint8Array([255, 255, 255]);
    this.renderMode = material.renderMode || 0;
    this.sizzle = material.sizzle || false;
  }
}
