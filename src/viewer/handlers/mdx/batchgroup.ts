import MdxModel from './model';
import MdxComplexInstance from './complexinstance';
import Batch from './batch';
import Scene from '../../scene';

/**
 * A group of batches that are going to be rendered together.
 */
export default class BatchGroup {
  model: MdxModel;
  isExtended: boolean;
  objects: number[];

  constructor(model: MdxModel, isExtended: boolean) {
    this.model = model;
    this.isExtended = isExtended;
    this.objects = [];
  }

  render(instance: MdxComplexInstance) {
    let scene = <Scene>instance.scene;
    let model = this.model;
    let textures = model.textures;
    let handler = model.handler;
    let teamColors = handler.teamColors;
    let teamGlows = handler.teamGlows;
    let batches = model.batches;
    let replaceables = model.replaceables;
    let viewer = model.viewer;
    let gl = viewer.gl;
    let isExtended = this.isExtended;
    let shader;

    if (isExtended) {
      shader = handler.extendedShader;
    } else {
      shader = handler.complexShader;
    }

    shader.use();

    let uniforms = shader.uniforms;

    gl.uniformMatrix4fv(uniforms.u_mvp, false, scene.camera.worldProjectionMatrix);

    let boneTexture = instance.boneTexture;

    // Instances of models with no bones don't have a bone texture.
    if (boneTexture) {
      boneTexture.bind(15);

      gl.uniform1f(uniforms.u_hasBones, 1);
      gl.uniform1i(uniforms.u_boneMap, 15);
      gl.uniform1f(uniforms.u_vectorSize, 1 / boneTexture.width);
      gl.uniform1f(uniforms.u_rowSize, 1);
    } else {
      gl.uniform1f(uniforms.u_hasBones, 0);
    }

    gl.uniform1i(uniforms.u_texture, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.arrayBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);

    gl.uniform4fv(uniforms.u_vertexColor, instance.vertexColor);

    for (let index of this.objects) {
      let batch = <Batch>batches[index];
      let geoset = batch.geoset;
      let layer = batch.layer;
      let geosetIndex = geoset.index;
      let layerIndex = layer.index;
      let geosetColor = instance.geosetColors[geosetIndex];
      let layerAlpha = instance.layerAlphas[layerIndex];

      if (geosetColor[3] > 0 && layerAlpha > 0) {
        let layerTexture = instance.layerTextures[layerIndex];
        let uvAnim = instance.uvAnims[layerIndex];

        gl.uniform4fv(uniforms.u_geosetColor, geosetColor);

        gl.uniform1f(uniforms.u_layerAlpha, layerAlpha);

        gl.uniform2f(uniforms.u_uvTrans, uvAnim[0], uvAnim[1]);
        gl.uniform2f(uniforms.u_uvRot, uvAnim[2], uvAnim[3]);
        gl.uniform1f(uniforms.u_uvScale, uvAnim[4]);

        layer.bind(shader);

        let replaceable = replaceables[layerTexture];
        let texture;

        if (replaceable === 1) {
          texture = teamColors[instance.teamColor];
        } else if (replaceable === 2) {
          texture = teamGlows[instance.teamColor];
        } else {
          texture = textures[layerTexture];
        }

        viewer.webgl.bindTexture(instance.textureMapper.get(texture) || texture, 0);

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
