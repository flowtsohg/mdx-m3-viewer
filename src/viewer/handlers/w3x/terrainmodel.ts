import MdlxModel from '../../../parsers/mdlx/model';
import Shader from '../../gl/shader';
import War3MapViewerMap from './map';

/**
 * A static terrain model.
 */
export default class TerrainModel {
  map: War3MapViewerMap;
  vertexBuffer: WebGLBuffer;
  faceBuffer: WebGLBuffer;
  normalsOffset: number;
  uvsOffset: number;
  elements: number;
  locationAndTextureBuffer: WebGLBuffer;
  texturesOffset: number;
  instances: number;
  vao: WebGLVertexArrayObjectOES | null;

  constructor(map: War3MapViewerMap, arrayBuffer: ArrayBuffer, locations: number[], textures: number[], shader: Shader) {
    const gl = map.viewer.gl;
    const webgl = map.viewer.webgl;
    const instancedArrays = <ANGLE_instanced_arrays>webgl.extensions['ANGLE_instanced_arrays'];
    const vertexArrayObject = <OES_vertex_array_object>webgl.extensions['OES_vertex_array_object'];

    const parser = new MdlxModel();
    parser.load(arrayBuffer);

    const geoset = parser.geosets[0];
    const vertices = geoset.vertices;
    const normals = geoset.normals;
    const uvs = geoset.uvSets[0];
    const faces = geoset.faces;
    const normalsOffset = vertices.byteLength;
    const uvsOffset = normalsOffset + normals.byteLength;
    let vao = null;
    const attribs = shader.attribs;

    if (vertexArrayObject) {
      vao = vertexArrayObject.createVertexArrayOES();
      vertexArrayObject.bindVertexArrayOES(vao);
    }

    const vertexBuffer = <WebGLBuffer>gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvsOffset + uvs.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, normalsOffset, normals);
    gl.bufferSubData(gl.ARRAY_BUFFER, uvsOffset, uvs);

    if (vertexArrayObject) {
      gl.vertexAttribPointer(attribs['a_position'], 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribs['a_position']);

      gl.vertexAttribPointer(attribs['a_normal'], 3, gl.FLOAT, false, 0, normalsOffset);
      gl.enableVertexAttribArray(attribs['a_normal']);

      gl.vertexAttribPointer(attribs['a_uv'], 2, gl.FLOAT, false, 0, uvsOffset);
      gl.enableVertexAttribArray(attribs['a_uv']);
    }

    const texturesOffset = locations.length * 4;
    const locationAndTextureBuffer = <WebGLBuffer>gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, locationAndTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texturesOffset + textures.length, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(locations));
    gl.bufferSubData(gl.ARRAY_BUFFER, texturesOffset, new Uint8Array(textures));

    if (vertexArrayObject) {
      gl.vertexAttribPointer(attribs['a_instancePosition'], 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribs['a_instancePosition']);
      instancedArrays.vertexAttribDivisorANGLE(attribs['a_instancePosition'], 1);

      gl.vertexAttribPointer(attribs['a_instanceTexture'], 1, gl.UNSIGNED_BYTE, false, 0, texturesOffset);
      gl.enableVertexAttribArray(attribs['a_instanceTexture']);
      instancedArrays.vertexAttribDivisorANGLE(attribs['a_instanceTexture'], 1);

    }

    const faceBuffer = <WebGLBuffer>gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);

    if (vertexArrayObject) {
      vertexArrayObject.bindVertexArrayOES(null);
    }

    this.map = map;
    this.vertexBuffer = vertexBuffer;
    this.faceBuffer = faceBuffer;
    this.normalsOffset = normalsOffset;
    this.uvsOffset = uvsOffset;
    this.elements = faces.length;
    this.locationAndTextureBuffer = locationAndTextureBuffer;
    this.texturesOffset = texturesOffset;
    this.instances = locations.length / 3;
    this.vao = vao;
  }

  render(shader: Shader): void {
    const viewer = this.map.viewer;
    const gl = viewer.gl;
    const webgl = viewer.webgl;
    const instancedArrays = <ANGLE_instanced_arrays>webgl.extensions['ANGLE_instanced_arrays'];
    const vertexArrayObject = <OES_vertex_array_object>webgl.extensions['OES_vertex_array_object'];
    const attribs = shader.attribs;

    if (vertexArrayObject) {
      vertexArrayObject.bindVertexArrayOES(this.vao);
    } else {
      // Locations and textures.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.locationAndTextureBuffer);
      gl.vertexAttribPointer(attribs['a_instancePosition'], 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribPointer(attribs['a_instanceTexture'], 1, gl.UNSIGNED_BYTE, false, 0, this.texturesOffset);

      // Vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.vertexAttribPointer(attribs['a_position'], 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribPointer(attribs['a_normal'], 3, gl.FLOAT, false, 0, this.normalsOffset);
      gl.vertexAttribPointer(attribs['a_uv'], 2, gl.FLOAT, false, 0, this.uvsOffset);

      // Faces.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
    }

    // Draw.
    instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, 0, this.instances);

    if (vertexArrayObject) {
      vertexArrayObject.bindVertexArrayOES(null);
    }
  }
}
