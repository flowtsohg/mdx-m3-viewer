import {GeometryEmitter, EMITTER_RIBBON} from './geometryemitter';
import Ribbon from './ribbon';

/**
 * A ribbon emitter.
 */
export default class RibbonEmitter extends GeometryEmitter {
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
  bind(modelView, shader) {
    let modelObject = this.modelObject;
    let layer = modelObject.layer;
    let uvDivisor = layer.uvDivisor;
    let model = modelObject.model;
    let gl = model.viewer.gl;
    let uniforms = shader.uniforms;

    layer.bind(shader);

    modelView.bindTexture(modelObject.texture, 0);

    gl.uniform1f(uniforms.u_emitter, EMITTER_RIBBON);

    gl.uniform1f(uniforms.u_columns, uvDivisor[0]);
    gl.uniform1f(uniforms.u_rows, uvDivisor[1]);
  }
}
