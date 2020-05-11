import ShaderProgram from '../../gl/program';
import Scene from '../../scene';
import MdxModel from './model';
import MdxModelInstance from './modelinstance';
import Batch from './batch';
import Material from './material';

/**
 * A group of batches that are going to be rendered together.
 */
export default class BatchGroup {
  model: MdxModel;
  isExtended: boolean;
  isHd: boolean;
  objects: number[] = [];

  constructor(model: MdxModel, isExtended: boolean, isHd: boolean) {
    this.model = model;
    this.isExtended = isExtended;
    this.isHd = isHd;
  }

  render(instance: MdxModelInstance) {
    let scene = <Scene>instance.scene;
    let textureMapper = instance.textureMapper;
    let layerAlphas = instance.layerAlphas;
    let model = this.model;
    let textures = model.textures;
    let batches = model.batches;
    let viewer = model.viewer;
    let mdxCache = viewer.sharedCache.get('mdx');
    let gl = viewer.gl;
    let webgl = viewer.webgl;
    let isExtended = this.isExtended;
    let isHd = this.isHd;
    let isReforged = model.reforged;
    let teamColors;
    let teamGlows;
    let shader;

    if (isReforged) {
      teamColors = mdxCache.reforgedTeamColors;
      teamGlows = mdxCache.reforgedTeamGlows;
    } else {
      teamColors = mdxCache.teamColors;
      teamGlows = mdxCache.teamGlows;
    }

    if (isExtended) {
      shader = <ShaderProgram>mdxCache.extendedShader;
    } else if (isHd) {
      shader = <ShaderProgram>mdxCache.hdShader;
    } else {
      shader = <ShaderProgram>mdxCache.standardShader;
    }

    shader.use();

    let uniforms = shader.uniforms;

    gl.uniformMatrix4fv(uniforms.u_VP, false, scene.camera.viewProjectionMatrix);

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

    if (isHd) {
      gl.uniform1i(uniforms.u_diffuseMap, 0);
      gl.uniform1i(uniforms.u_ormMap, 1);
      gl.uniform1i(uniforms.u_teamColorMap, 2);

      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);

      for (let index of this.objects) {
        let batch = batches[index];
        let geoset = batch.geoset;
        let material = <Material>batch.material;
        let layers = material.layers;
        let diffuseLayer = layers[0];
        let ormLayer = layers[2];
        let layerAlpha = layerAlphas[diffuseLayer.index];

        if (layerAlpha > 0) {
          gl.uniform1f(uniforms.u_layerAlpha, layerAlpha);
          gl.uniform1f(uniforms.u_filterMode, diffuseLayer.filterMode);

          let diffuseTexture = textures[diffuseLayer.textureId];
          let ormTexture = textures[ormLayer.textureId];
          let teamColorTexture = teamColors[instance.teamColor];

          webgl.bindTexture(textureMapper.get(diffuseTexture) || diffuseTexture, 0);
          webgl.bindTexture(textureMapper.get(ormTexture) || ormTexture, 1);
          webgl.bindTexture(textureMapper.get(teamColorTexture) || teamColorTexture, 2);

          geoset.bindHd(shader, diffuseLayer.coordId);
          geoset.render();
        }
      }
    } else {
      let replaceables = model.replaceables;
      let geosetColors = instance.geosetColors;
      let layerTextures = instance.layerTextures;
      let uvAnims = instance.uvAnims;

      gl.uniform4fv(uniforms.u_vertexColor, instance.vertexColor);

      for (let object of this.objects) {
        let batch = <Batch>batches[object];
        let geoset = batch.geoset;
        let layer = batch.layer;
        let geosetIndex = geoset.index;
        let layerIndex = layer.index;
        let geosetColor = geosetColors[geosetIndex];
        let layerAlpha = layerAlphas[layerIndex];

        if (geosetColor[3] > 0.01 && layerAlpha > 0.01) {
          let layerTexture = layerTextures[layerIndex];
          let uvAnim = uvAnims[layerIndex];

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

            // Overriding.
            texture = textureMapper.get(texture) || texture;
          }

          webgl.bindTexture(texture, 0);

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
}
