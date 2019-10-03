import {GeometryEmitter, EMITTER_PARTICLE2} from './geometryemitter';
import Particle2 from './particle2';

/**
 * An MDX particle emitter type 2.
 */
export default class ParticleEmitter2 extends GeometryEmitter {
  /**
   * @param {ParticleEmitter2View} emitterView
   */
  emit(emitterView) {
    if (this.modelObject.head) {
      this.emitObject(emitterView, 0);
    }

    if (this.modelObject.tail) {
      this.emitObject(emitterView, 1);
    }
  }

  /**
   * @return {Particle2}
   */
  createObject() {
    return new Particle2(this);
  }

  /**
   * @param {ModelView} modelView
   * @param {ShaderProgram} shader
   */
  bind(modelView, shader) {
    let camera = this.modelViewData.scene.camera;
    let modelObject = this.modelObject;
    let model = modelObject.model;
    let gl = model.viewer.gl;
    let uniforms = shader.uniforms;
    let colors = modelObject.floatColors;
    let intervals = modelObject.intervals;
    let vectors;

    gl.blendFunc(modelObject.blendSrc, modelObject.blendDst);

    modelView.bindTexture(modelObject.internalResource, 0);

    // Choose between a default rectangle or a billboarded one
    if (modelObject.xYQuad) {
      vectors = camera.vectors;
    } else {
      vectors = camera.billboardedVectors;
    }

    gl.uniform1f(uniforms.u_emitter, EMITTER_PARTICLE2);

    gl.uniform1f(uniforms.u_lifeSpan, modelObject.lifeSpan);
    gl.uniform1f(uniforms.u_timeMiddle, modelObject.timeMiddle);
    gl.uniform1f(uniforms.u_columns, modelObject.columns);
    gl.uniform1f(uniforms.u_rows, modelObject.rows);
    gl.uniform1f(uniforms.u_teamColored, modelObject.teamColored);

    gl.uniform3fv(uniforms['u_intervals[0]'], intervals[0]);
    gl.uniform3fv(uniforms['u_intervals[1]'], intervals[1]);
    gl.uniform3fv(uniforms['u_intervals[2]'], intervals[2]);
    gl.uniform3fv(uniforms['u_intervals[3]'], intervals[3]);

    gl.uniform4fv(uniforms['u_colors[0]'], colors[0]);
    gl.uniform4fv(uniforms['u_colors[1]'], colors[1]);
    gl.uniform4fv(uniforms['u_colors[2]'], colors[2]);

    gl.uniform3fv(uniforms.u_scaling, modelObject.scaling);

    if (modelObject.head) {
      gl.uniform3fv(uniforms['u_vertices[0]'], vectors[0]);
      gl.uniform3fv(uniforms['u_vertices[1]'], vectors[1]);
      gl.uniform3fv(uniforms['u_vertices[2]'], vectors[2]);
      gl.uniform3fv(uniforms['u_vertices[3]'], vectors[3]);
    }

    if (modelObject.tail) {
      gl.uniform3fv(uniforms.u_cameraZ, camera.billboardedVectors[6]);
    }
  }
}
