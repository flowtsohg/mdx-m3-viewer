import {GeometryEmitter, EMITTER_SPLAT} from './geometryemitter';
import EventObjectSplUbr from './eventobjectsplubr';

/**
 * An MDX splat emitter.
 */
export default class EventObjectSplEmitter extends GeometryEmitter {
  /**
   * @param {EventObjectEmitterView} emitterView
   */
  emit(emitterView) {
    if (this.modelObject.ok) {
      this.emitObject(emitterView);
    }
  }

  /**
   * @return {EventObjectSplUbr}
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
    let intervals = modelObject.intervals;
    let colors = modelObject.colors;
    let model = modelObject.model;
    let gl = model.viewer.gl;
    let uniforms = shader.uniforms;

    gl.blendFunc(modelObject.blendSrc, modelObject.blendDst);

    model.bindTexture(modelObject.internalResource, 0, modelView);

    gl.uniform1f(uniforms.u_emitter, EMITTER_SPLAT);

    gl.uniform1f(uniforms.u_lifeSpan, modelObject.lifeSpan);
    gl.uniform1f(uniforms.u_columns, modelObject.columns);
    gl.uniform1f(uniforms.u_rows, modelObject.rows);

    // 3 because the uniform is shared with UBR, which has 3 intervals.
    gl.uniform3f(uniforms.u_intervalTimes, intervalTimes[0], intervalTimes[1], 0);

    gl.uniform3fv(uniforms['u_intervals[0]'], intervals[0]);
    gl.uniform3fv(uniforms['u_intervals[1]'], intervals[1]);

    gl.uniform4fv(uniforms['u_colors[0]'], colors[0]);
    gl.uniform4fv(uniforms['u_colors[1]'], colors[1]);
    gl.uniform4fv(uniforms['u_colors[2]'], colors[2]);
  }
}
