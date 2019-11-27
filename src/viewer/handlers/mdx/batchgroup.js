/**
 * A group of batches that are going to be rendered together.
 */
export default class BatchGroup {
  /**
   * @param {Model} model
   * @param {boolean} isExtended
   */
  constructor(model, isExtended) {
    /** @member {Model} */
    this.model = model;
    /** @member {boolean} */
    this.isExtended = isExtended;
    /** @member {Array<Batch>} */
    this.objects = [];
  }

  /**
   * @param {ModelInstance} instance
   */
  render(instance) {
    let model = this.model;
    let batches = model.batches;
    let viewer = model.viewer;
    let gl = viewer.gl;
    let scene = instance.scene;
    let isExtended = this.isExtended;
    let shader;

    if (isExtended) {
      shader = model.handler.extendedShader;
    } else {
      shader = model.handler.complexShader;
    }

    shader.use();

    let uniforms = shader.uniforms;

    for (let index of this.objects) {
      let batch = batches[index];
      let geoset = batch.geoset;
      let layer = batch.layer;
      let geosetIndex = geoset.index;
      let layerIndex = layer.index;
      let geosetColor = instance.geosetColors[geosetIndex];
      let layerAlpha = instance.layerAlphas[layerIndex];

      if (geosetColor[3] > 0 && layerAlpha > 0) {
        let layerTexture = instance.layerTextures[layerIndex];
        let uvAnim = instance.uvAnims[layerIndex];

        gl.uniformMatrix4fv(uniforms.u_mvp, false, scene.camera.worldProjectionMatrix);

        gl.uniform4fv(uniforms.u_vertexColor, instance.vertexColor);
        gl.uniform4fv(uniforms.u_geosetColor, geosetColor);

        gl.uniform1f(uniforms.u_layerAlpha, layerAlpha);

        gl.uniform2f(uniforms.u_uvTrans, uvAnim[0], uvAnim[1]);
        gl.uniform2f(uniforms.u_uvRot, uvAnim[2], uvAnim[3]);
        gl.uniform1f(uniforms.u_uvScale, uvAnim[4]);

        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, instance.boneTexture);
        gl.uniform1i(uniforms.u_boneMap, 15);
        gl.uniform1f(uniforms.u_vectorSize, instance.vectorSize);
        gl.uniform1f(uniforms.u_rowSize, 1);

        layer.bind(shader);

        let replaceable = model.replaceables[layerTexture];
        let texture;

        if (replaceable === 1) {
          texture = model.handler.teamColors[instance.teamColor];
        } else if (replaceable === 2) {
          texture = model.handler.teamGlows[instance.teamColor];
        } else {
          texture = model.textures[layerTexture];
        }

        gl.uniform1i(uniforms.u_texture, 0);
        viewer.webgl.bindTexture(instance.textureMapper.get(texture) || texture, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.arrayBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);

        if (isExtended) {
          geoset.bindExtended(shader, layer.coordId);
        } else {
          geoset.bind(shader, layer.coordId);
        }

        geoset.render();
      }
    }
  }
}
