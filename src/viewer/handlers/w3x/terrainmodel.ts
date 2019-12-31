import MdlxModel from '../../../parsers/mdlx/model';
import ShaderProgram from '../../gl/program';
import War3MapViewer from './viewer';

/**
 * A static terrain model.
 */
export default class TerrainModel {
  viewer: War3MapViewer;
  vertexBuffer: WebGLBuffer;
  faceBuffer: WebGLBuffer;
  normalsOffset: number;
  uvsOffset: number;
  elements: number;
  locationAndTextureBuffer: WebGLBuffer;
  texturesOffset: number;
  instances: number;
  vao: WebGLVertexArrayObjectOES | null;

  constructor(viewer: War3MapViewer, arrayBuffer: ArrayBuffer, locations: number[], textures: number[], shader: ShaderProgram) {
    let gl = viewer.gl;
    let webgl = viewer.webgl;
    let instancedArrays = <ANGLE_instanced_arrays>webgl.extensions.ANGLE_instanced_arrays
    let vertexArrayObject = <OES_vertex_array_object>webgl.extensions.OES_vertex_array_object;
    let parser = new MdlxModel(arrayBuffer);
    let geoset = parser.geosets[0];
    let vertices = geoset.vertices;
    let normals = geoset.normals;
    let uvs = geoset.uvSets[0];
    let faces = geoset.faces;
    let normalsOffset = vertices.byteLength;
    let uvsOffset = normalsOffset + normals.byteLength;
    let vao = null;
    let attribs = shader.attribs;

    if (vertexArrayObject) {
      vao = vertexArrayObject.createVertexArrayOES();
      vertexArrayObject.bindVertexArrayOES(vao);
    }

    let vertexBuffer = <WebGLBuffer>gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvsOffset + uvs.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, normalsOffset, normals);
    gl.bufferSubData(gl.ARRAY_BUFFER, uvsOffset, uvs);

    if (vertexArrayObject) {
      gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribs.a_position);

      gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, normalsOffset);
      gl.enableVertexAttribArray(attribs.a_normal);

      gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, uvsOffset);
      gl.enableVertexAttribArray(attribs.a_uv);
    }

    let texturesOffset = locations.length * 4;
    let locationAndTextureBuffer = <WebGLBuffer>gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, locationAndTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texturesOffset + textures.length, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(locations));
    gl.bufferSubData(gl.ARRAY_BUFFER, texturesOffset, new Uint8Array(textures));

    if (vertexArrayObject) {
      gl.vertexAttribPointer(attribs.a_instancePosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribs.a_instancePosition);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instancePosition, 1);

      gl.vertexAttribPointer(attribs.a_instanceTexture, 1, gl.UNSIGNED_BYTE, false, 0, texturesOffset);
      gl.enableVertexAttribArray(attribs.a_instanceTexture);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceTexture, 1);

    }

    let faceBuffer = <WebGLBuffer>gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);

    if (vertexArrayObject) {
      vertexArrayObject.bindVertexArrayOES(null);
    }

    this.viewer = viewer;
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

  render(shader: ShaderProgram) {
    let viewer = this.viewer;
    let gl = viewer.gl;
    let webgl = viewer.webgl;
    let instancedArrays = <ANGLE_instanced_arrays>webgl.extensions.ANGLE_instanced_arrays
    let vertexArrayObject = <OES_vertex_array_object>webgl.extensions.OES_vertex_array_object;
    let attribs = shader.attribs;

    if (vertexArrayObject) {
      vertexArrayObject.bindVertexArrayOES(this.vao);
    } else {
      // Locations and textures.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.locationAndTextureBuffer);
      gl.vertexAttribPointer(attribs.a_instancePosition, 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribPointer(attribs.a_instanceTexture, 1, gl.UNSIGNED_BYTE, false, 0, this.texturesOffset);

      // Vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, this.normalsOffset);
      gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvsOffset);

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
