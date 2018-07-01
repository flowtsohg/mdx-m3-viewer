import SharedGeometryEmitter from './sharedgeometryemitter';
import Ribbon from './ribbon';

/**
 * A ribbon emitter.
 */
export default class RibbonEmitter extends SharedGeometryEmitter {
  /**
   * @param {RibbonEmitter} modelObject
   */
  constructor(modelObject) {
    super(modelObject);

    this.elementsPerEmit = 30;
  }

  /**
   * @param {RibbonEmitterView} emitterView
   */
  emit(emitterView) {
    emitterView.lastEmit = this.emitObject(emitterView);
  }

  /**
   * @return {Ribbon}
   */
  createObject() {
    return new Ribbon(this);
  }

  /**
   * @param {*} emitterView
   */
  fill(emitterView) {
    let emission = emitterView.currentEmission;

    if (emission >= 1) {
      this.emit(emitterView);
      emitterView.currentEmission--;
    }
  }

  /**
   * @param {ModelView} modelView
   * @param {ShaderProgram} shader
   */
  render(modelView, shader) {
    let active = this.active.length;

    if (active > 0) {
      let modelObject = this.modelObject;
      let model = modelObject.model;
      let gl = model.viewer.gl;

      modelObject.layer.bind(shader);

      gl.uniform2fv(shader.uniforms.u_dimensions, modelObject.dimensions);

      model.bindTexture(modelObject.texture, 0, modelView);

      /// TODO: Move texture wrap modes into the textures.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data.subarray(0, active * 30));

      gl.vertexAttribPointer(shader.attribs.a_position, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(shader.attribs.a_uva_rgb, 2, gl.FLOAT, false, 20, 12);

      gl.drawArrays(gl.TRIANGLES, 0, active * 6);
    }
  }
}
