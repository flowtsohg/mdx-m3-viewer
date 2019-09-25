/**
 * A group of emitters that are going to be rendered together.
 */
export default class EmitterGroup {
  /**
   * @param {ModelView} modelView
   * @param {boolean} isRibbons
   */
  constructor(modelView, isRibbons) {
    /** @member {ModelView} */
    this.modelView = modelView;
    /** @member {Array<ParticleEmitter2|RibbonEmitter>} */
    this.objects = [];
    /** @member {boolean} */
    this.isRibbons = isRibbons;
  }

  /**
   * @param {ModelViewData} modelViewData
   */
  render(modelViewData) {
    let viewer = this.modelView.model.viewer;
    let gl = viewer.gl;
    let modelView = modelViewData.modelView;
    let shader = viewer.shaderMap.get('MdxParticleShader');

    gl.depthMask(0);
    gl.enable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    viewer.webgl.useShaderProgram(shader);

    gl.uniformMatrix4fv(shader.uniforms.u_mvp, false, modelViewData.scene.camera.worldProjectionMatrix);
    gl.uniform1i(shader.uniforms.u_texture, 0);
    gl.uniform1f(shader.uniforms.u_isRibbonEmitter, this.isRibbons);

    for (let emitter of this.objects) {
      emitter.render(modelView, shader);
    }
  }
}
