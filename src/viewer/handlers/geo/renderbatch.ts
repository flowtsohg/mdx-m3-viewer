import ShaderProgram from '../../gl/program';
import ClientBuffer from '../../gl/clientbuffer';
import RenderBatch from '../../renderbatch';
import GeometryModelInstance from './modelinstance';
import GeometryModel from './model';

/**
 * A render batch.
 */
export default class GeoRenderBatch extends RenderBatch {
  bindAndUpdateBuffer(buffer: ClientBuffer) {
    let count = this.count;
    let instances = <GeometryModelInstance[]>this.instances;

    // Ensure there is enough memory for all of the instances data.
    buffer.reserve(count * 54);

    let floatView = <Float32Array>buffer.floatView;
    let byteView = <Uint8Array>buffer.byteView;
    let baseColorOffset = count * 48;

    // "Copy" the instances into the buffer.
    for (let i = 0; i < count; i++) {
      let instance = instances[i];
      let worldMatrix = instance.worldMatrix;
      let faceColor = instance.faceColor;
      let edgeColor = instance.edgeColor;
      let offset = i * 12;

      floatView[offset + 0] = worldMatrix[0];
      floatView[offset + 1] = worldMatrix[1];
      floatView[offset + 2] = worldMatrix[2];
      floatView[offset + 3] = worldMatrix[4];
      floatView[offset + 4] = worldMatrix[5];
      floatView[offset + 5] = worldMatrix[6];
      floatView[offset + 6] = worldMatrix[8];
      floatView[offset + 7] = worldMatrix[9];
      floatView[offset + 8] = worldMatrix[10];
      floatView[offset + 9] = worldMatrix[12];
      floatView[offset + 10] = worldMatrix[13];
      floatView[offset + 11] = worldMatrix[14];

      offset = baseColorOffset + i * 6;

      byteView[offset + 0] = faceColor[0];
      byteView[offset + 1] = faceColor[1];
      byteView[offset + 2] = faceColor[2];
      byteView[offset + 3] = edgeColor[0];
      byteView[offset + 4] = edgeColor[1];
      byteView[offset + 5] = edgeColor[2];
    }

    // Update the buffer.
    buffer.bindAndUpdate(count * 54);
  }

  render() {
    let count = this.count;

    if (count) {
      let model = <GeometryModel>this.model;
      let viewer = model.viewer;
      let geoCache = viewer.sharedCache.get('geo');
      let gl = viewer.gl;
      let webgl = viewer.webgl;
      let instancedArrays = <ANGLE_instanced_arrays>webgl.extensions.ANGLE_instanced_arrays;
      let shader = <ShaderProgram>geoCache.shader;
      let uniforms = shader.uniforms;
      let attribs = shader.attribs;
      let m0 = attribs.a_m0;
      let m1 = attribs.a_m1;
      let m2 = attribs.a_m2;
      let m3 = attribs.a_m3;
      let faceColor = attribs.a_faceColor;
      let edgeColor = attribs.a_edgeColor;
      let buffer = viewer.buffer;
      let textureMapper = this.textureMapper;

      shader.use();

      this.bindAndUpdateBuffer(buffer);

      gl.vertexAttribPointer(m0, 3, gl.FLOAT, false, 48, 0);
      gl.vertexAttribPointer(m1, 3, gl.FLOAT, false, 48, 12);
      gl.vertexAttribPointer(m2, 3, gl.FLOAT, false, 48, 24);
      gl.vertexAttribPointer(m3, 3, gl.FLOAT, false, 48, 36);
      gl.vertexAttribPointer(faceColor, 3, gl.UNSIGNED_BYTE, true, 6, count * 48);
      gl.vertexAttribPointer(edgeColor, 3, gl.UNSIGNED_BYTE, true, 6, count * 48 + 3);

      gl.uniform1i(uniforms.u_texture, 0);
      gl.uniformMatrix4fv(uniforms.u_VP, false, this.scene.camera.viewProjectionMatrix);

      // Vertices
      gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
      gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 12, 0);

      // UVs
      gl.bindBuffer(gl.ARRAY_BUFFER, model.uvBuffer);
      gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 8, 0);

      instancedArrays.vertexAttribDivisorANGLE(m0, 1);
      instancedArrays.vertexAttribDivisorANGLE(m1, 1);
      instancedArrays.vertexAttribDivisorANGLE(m2, 1);
      instancedArrays.vertexAttribDivisorANGLE(m3, 1);
      instancedArrays.vertexAttribDivisorANGLE(faceColor, 1);
      instancedArrays.vertexAttribDivisorANGLE(edgeColor, 1);

      if (model.twoSided) {
        gl.disable(gl.CULL_FACE);
      } else {
        gl.enable(gl.CULL_FACE);
      }

      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.disable(gl.BLEND);

      // Faces.
      // Can be textured or not.
      if (model.renderMode !== 1) {
        let texture = textureMapper.get(0) || model.texture;

        webgl.bindTexture(texture, 0);

        let hasTexture = uniforms.u_hasTexture;
        if (texture) {
          gl.uniform1f(hasTexture, 1);
          gl.uniform1f(uniforms.u_sizzle, model.sizzle ? 1 : 0);
        } else {
          gl.uniform1f(hasTexture, 0);
        }

        gl.uniform1f(uniforms.u_isEdge, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.faceBuffer);
        instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, model.faceElements, model.faceIndexType, 0, count);
      }

      // Edges.
      if (model.renderMode !== 0) {
        gl.uniform1f(uniforms.u_isEdge, 1);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.edgeBuffer);
        instancedArrays.drawElementsInstancedANGLE(gl.LINES, model.edgeElements, model.edgeIndexType, 0, count);
      }

      instancedArrays.vertexAttribDivisorANGLE(edgeColor, 0);
      instancedArrays.vertexAttribDivisorANGLE(faceColor, 0);
      instancedArrays.vertexAttribDivisorANGLE(m3, 0);
      instancedArrays.vertexAttribDivisorANGLE(m2, 0);
      instancedArrays.vertexAttribDivisorANGLE(m1, 0);
      instancedArrays.vertexAttribDivisorANGLE(m0, 0);
    }
  }
}
