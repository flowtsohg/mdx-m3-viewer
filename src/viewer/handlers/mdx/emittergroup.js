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
    let webgl = viewer.webgl;
    let scene = modelViewData.scene;
    let modelView = modelViewData.modelView;

    gl.depthMask(0);
    gl.enable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    let shader = viewer.shaderMap.get('MdxParticleShader');
    webgl.useShaderProgram(shader);

    gl.uniformMatrix4fv(shader.uniforms.u_mvp, false, scene.camera.worldProjectionMatrix);

    gl.uniform1i(shader.uniforms.u_texture, 0);

    gl.uniform1f(shader.uniforms.u_isRibbonEmitter, this.isRibbons);

    for (let emitter of this.objects) {
      emitter.render(modelView, shader);
    }
  }
}
