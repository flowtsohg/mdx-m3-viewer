import Model from '../../model';
import Texture from '../../texture';

/**
 * A geometry model.
 *
 * Used to render simple geometric shapes.
 */
export default class GeometryModel extends Model {
  vertexBuffer: WebGLBuffer | null = null;
  uvBuffer: WebGLBuffer | null = null;
  faceBuffer: WebGLBuffer | null = null;
  edgeBuffer: WebGLBuffer | null = null;
  faceIndexType: number = 0;
  edgeIndexType: number = 0;
  faceElements: number = 0;
  edgeElements: number = 0;
  texture: Texture | null = null;
  twoSided: boolean = false;
  faceColor: Uint8Array = new Uint8Array([255, 255, 255]);
  edgeColor: Uint8Array = new Uint8Array([255, 255, 255]);
  renderMode: number = 0;
  sizzle: number = 0;

  load(src: object) {
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

    this.boundingRadius = geometry.boundingRadius; /// TODO: Handle the bounds

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

    this.faceElements = geometry.faces.length;
    this.edgeElements = geometry.edges.length;

    if (material.texture) {
      this.texture = material.texture;
    }

    let texture = material.texture;
    let twoSided = material.twoSided;
    let faceColor = material.faceColor;
    let edgeColor = material.edgeColor;
    let renderMode = material.renderMode;
    let sizzle = material.sizzle;

    if (texture) {
      this.texture = texture;
    }

    this.twoSided = twoSided || false;

    if (faceColor) {
      this.faceColor.set(faceColor);
    }

    if (edgeColor) {
      this.edgeColor.set(edgeColor);
    }

    this.renderMode = renderMode || 0;
    this.sizzle = sizzle || false;
  }
}
