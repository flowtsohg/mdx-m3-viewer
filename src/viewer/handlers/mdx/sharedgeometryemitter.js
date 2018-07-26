import {powerOfTwo} from '../../../common/math';
import SharedEmitter from './sharedemitter';

/**
 * Shared structure used by all geometry emitters.
 */
export default class SharedGeometryEmitter extends SharedEmitter {
  /**
   * @param {ParticleEmitter2|RibbonEmitter|EventObjectSplEmitter|EventObjectUbrEmitter} modelObject
   */
  constructor(modelObject) {
    super(modelObject);

    this.data = new Float32Array(0);
    this.buffer = modelObject.model.viewer.gl.createBuffer();
    this.bufferSize = 0;
  }

  /**
   * @param {ParticleEmitter2View|RibbonEmitterView|EventObjectEmitterView} emitterView
   * @param {boolean} flag
   * @return {Particle2|Ribbon|EventObjectSpl|EventObjectUbr}
   */
  emitObject(emitterView, flag) {
    return super.emitObject(emitterView, flag);
  }

  /**
   *
   */
  updateData() {
    let objects = this.objects;
    let alive = this.alive;
    let sizeNeeded = alive * this.elementsPerEmit;

    if (this.data.length < sizeNeeded) {
      this.data = new Float32Array(powerOfTwo(sizeNeeded));

      let gl = this.modelObject.model.viewer.gl;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);
    }

    let data = this.data;

    for (let i = 0, offset = 0; i < alive; i += 1, offset += 30) {
      let object = objects[i];
      let vertices = object.vertices;
      let lta = object.lta;
      let lba = object.lba;
      let rta = object.rta;
      let rba = object.rba;
      let rgb = object.rgb;

      data[offset + 0] = vertices[0];
      data[offset + 1] = vertices[1];
      data[offset + 2] = vertices[2];
      data[offset + 3] = lta;
      data[offset + 4] = rgb;

      data[offset + 5] = vertices[3];
      data[offset + 6] = vertices[4];
      data[offset + 7] = vertices[5];
      data[offset + 8] = lba;
      data[offset + 9] = rgb;

      data[offset + 10] = vertices[6];
      data[offset + 11] = vertices[7];
      data[offset + 12] = vertices[8];
      data[offset + 13] = rba;
      data[offset + 14] = rgb;

      data[offset + 15] = vertices[0];
      data[offset + 16] = vertices[1];
      data[offset + 17] = vertices[2];
      data[offset + 18] = lta;
      data[offset + 19] = rgb;

      data[offset + 20] = vertices[6];
      data[offset + 21] = vertices[7];
      data[offset + 22] = vertices[8];
      data[offset + 23] = rba;
      data[offset + 24] = rgb;

      data[offset + 25] = vertices[9];
      data[offset + 26] = vertices[10];
      data[offset + 27] = vertices[11];
      data[offset + 28] = rta;
      data[offset + 29] = rgb;
    }
  }

  /**
   * @param {ModelView} modelView
   * @param {ShaderProgram} shader
   */
  render(modelView, shader) {
    let modelObject = this.modelObject;
    let alive = this.alive;

    if (modelObject.internalResource && alive > 0) {
      let model = modelObject.model;
      let gl = model.viewer.gl;

      gl.blendFunc(modelObject.blendSrc, modelObject.blendDst);

      gl.uniform2fv(shader.uniforms.u_dimensions, modelObject.dimensions);

      model.bindTexture(modelObject.internalResource, 0, modelView);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data.subarray(0, alive * 30));

      gl.vertexAttribPointer(shader.attribs.a_position, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(shader.attribs.a_uva_rgb, 2, gl.FLOAT, false, 20, 12);

      gl.drawArrays(gl.TRIANGLES, 0, alive * 6);
    }
  }
}
