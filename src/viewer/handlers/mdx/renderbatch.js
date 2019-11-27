import RenderBatch from '../../renderbatch';

/**
 * A render batch.
 */
export default class MdxRenderBatch extends RenderBatch {
  /**
   * @param {ClientBuffer} buffer
   */
  bindAndUpdateBuffer(buffer) {
    let count = this.count;
    let instances = this.instances;

    // Ensure there is enough memory for all of the instances data.
    buffer.reserve(count * 48);

    let floatView = buffer.floatView;

    // "Copy" the instances into the buffer.
    for (let i = 0; i < count; i++) {
      let instance = instances[i];
      let worldMatrix = instance.worldMatrix;
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
    }

    // Update the buffer.
    buffer.bindAndUpdate(count * 48);
  }

  /**
   * @override
   */
  render() {
    let count = this.count;

    if (count) {
      let model = this.model;
      let batches = model.batches;
      let textures = model.textures;
      let viewer = model.viewer;
      let gl = viewer.gl;
      let instancedArrays = gl.extensions.instancedArrays;
      let shader = model.handler.simpleShader;
      let uniforms = shader.uniforms;
      let attribs = shader.attribs;
      let m0 = attribs.a_m0;
      let m1 = attribs.a_m1;
      let m2 = attribs.a_m2;
      let m3 = attribs.a_m3;
      let buffer = viewer.buffer;
      let textureMapper = this.textureMapper;

      viewer.webgl.useShaderProgram(shader);

      this.bindAndUpdateBuffer(buffer);

      gl.vertexAttribPointer(m0, 3, gl.FLOAT, false, 48, 0);
      gl.vertexAttribPointer(m1, 3, gl.FLOAT, false, 48, 12);
      gl.vertexAttribPointer(m2, 3, gl.FLOAT, false, 48, 24);
      gl.vertexAttribPointer(m3, 3, gl.FLOAT, false, 48, 36);

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.scene.camera.worldProjectionMatrix);

      gl.bindBuffer(gl.ARRAY_BUFFER, model.arrayBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);

      instancedArrays.vertexAttribDivisorANGLE(m0, 1);
      instancedArrays.vertexAttribDivisorANGLE(m1, 1);
      instancedArrays.vertexAttribDivisorANGLE(m2, 1);
      instancedArrays.vertexAttribDivisorANGLE(m3, 1);

      for (let index of model.groups[0].objects) {
        let batch = batches[index];
        let geoset = batch.geoset;
        let layer = batch.layer;
        let texture = textures[layer.textureId];

        gl.uniform1i(uniforms.u_texture, 0);
        viewer.webgl.bindTexture(textureMapper.get(texture) || texture, 0);

        layer.bind(shader);

        geoset.bindSimple(shader);
        geoset.renderSimple(count);
      }

      instancedArrays.vertexAttribDivisorANGLE(m3, 0);
      instancedArrays.vertexAttribDivisorANGLE(m2, 0);
      instancedArrays.vertexAttribDivisorANGLE(m1, 0);
      instancedArrays.vertexAttribDivisorANGLE(m0, 0);
    }
  }
}
