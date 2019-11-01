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
    buffer.reserve(count * 64);

    let floatView = buffer.floatView;

    // "Copy" the instances into the buffer.
    for (let i = 0; i < count; i++) {
      let instance = instances[i];
      let worldMatrix = instance.worldMatrix;
      let offset = i * 16;

      for (let m = 0; m < 16; m++) {
        floatView[offset + m] = worldMatrix[m];
      }
    }

    // Update the buffer.
    buffer.bindAndUpdate(count * 64);
  }

  /**
   * @override
   */
  render() {
    let count = this.count;

    if (count) {
      let model = this.model;
      let batches = model.batches;
      let shallowGeosets = model.shallowGeosets;
      let textures = model.textures;
      let viewer = model.viewer;
      let gl = viewer.gl;
      let instancedArrays = gl.extensions.instancedArrays;
      let shader = viewer.shaderMap.get('MdxSimpleShader');
      let uniforms = shader.uniforms;
      let attribs = shader.attribs;
      let m0 = attribs.a_m0;
      let m1 = attribs.a_m1;
      let m2 = attribs.a_m2;
      let m3 = attribs.a_m3;
      let buffer = viewer.buffer;

      viewer.webgl.useShaderProgram(shader);

      this.bindAndUpdateBuffer(buffer);

      gl.vertexAttribPointer(m0, 4, gl.FLOAT, false, 64, 0);
      gl.vertexAttribPointer(m1, 4, gl.FLOAT, false, 64, 16);
      gl.vertexAttribPointer(m2, 4, gl.FLOAT, false, 64, 32);
      gl.vertexAttribPointer(m3, 4, gl.FLOAT, false, 64, 48);

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.scene.camera.worldProjectionMatrix);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.__webglElementBuffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, model.__webglArrayBuffer);

      instancedArrays.vertexAttribDivisorANGLE(m0, 1);
      instancedArrays.vertexAttribDivisorANGLE(m1, 1);
      instancedArrays.vertexAttribDivisorANGLE(m2, 1);
      instancedArrays.vertexAttribDivisorANGLE(m3, 1);

      for (let index of model.groups[0].objects) {
        let batch = batches[index];
        let geoset = batch.geoset;
        let layer = batch.layer;
        let shallowGeoset = shallowGeosets[geoset.index];

        gl.uniform1i(uniforms.u_texture, 0);
        viewer.webgl.bindTexture(textures[layer.textureId], 0);

        layer.bind(shader);

        shallowGeoset.bindNew(shader, 0);
        shallowGeoset.renderInstanced(count);
      }

      instancedArrays.vertexAttribDivisorANGLE(m3, 0);
      instancedArrays.vertexAttribDivisorANGLE(m2, 0);
      instancedArrays.vertexAttribDivisorANGLE(m1, 0);
      instancedArrays.vertexAttribDivisorANGLE(m0, 0);
    }
  }
}
