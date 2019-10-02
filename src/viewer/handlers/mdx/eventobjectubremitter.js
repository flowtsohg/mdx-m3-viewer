import {GeometryEmitter, EMITTER_UBER} from './geometryemitter';
import EventObjectSplUbr from './eventobjectsplubr';

/**
 * An MDX ubersplat emitter.
 */
export default class EventObjectUbrEmitter extends GeometryEmitter {
  /**
   * @param {EventObjectEmitterView} emitterView
   */
  emit(emitterView) {
    if (this.modelObject.ok) {
      this.emitObject(emitterView);
    }
  }

  /**
   * @return {EventObjectUbr}
   */
  createObject() {
    return new EventObjectSplUbr(this);
  }

  /**
   * @param {ModelView} modelView
   * @param {ShaderProgram} shader
   */
  bind(modelView, shader) {
    let modelObject = this.modelObject;
    let intervalTimes = modelObject.intervalTimes;
    let colors = modelObject.colors;
    let model = modelObject.model;
    let gl = model.viewer.gl;
    let uniforms = shader.uniforms;

    gl.blendFunc(modelObject.blendSrc, modelObject.blendDst);

    model.bindTexture(modelObject.internalResource, 0, modelView);

    gl.uniform1f(uniforms.u_emitter, EMITTER_UBER);

    gl.uniform1f(uniforms.u_lifeSpan, modelObject.lifeSpan);
    gl.uniform1f(uniforms.u_columns, modelObject.columns);
    gl.uniform1f(uniforms.u_rows, modelObject.rows);

    gl.uniform3fv(uniforms.u_intervalTimes, intervalTimes);

    gl.uniform4fv(uniforms['u_colors[0]'], colors[0]);
    gl.uniform4fv(uniforms['u_colors[1]'], colors[1]);
    gl.uniform4fv(uniforms['u_colors[2]'], colors[2]);
  }
}
