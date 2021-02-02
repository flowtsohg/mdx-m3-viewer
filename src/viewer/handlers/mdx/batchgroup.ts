import Shader from '../../gl/shader';
import Scene from '../../scene';
import Texture from '../../texture';
import MdxModel from './model';
import MdxModelInstance from './modelinstance';
import Batch from './batch';
import Material from './material';
import MdxTexture from './texture';

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
    let textureOverrides = instance.textureOverrides;
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
    let teamColors = <MdxTexture[]>mdxCache.teamColors;
    let teamGlows = <MdxTexture[]>mdxCache.teamGlows;
    let shader;

    if (isExtended) {
      shader = <Shader>mdxCache.extendedShader;
    } else if (isHd) {
      shader = <Shader>mdxCache.hdShader;
    } else {
      shader = <Shader>mdxCache.standardShader;
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

          let diffuseId = diffuseLayer.textureId;
          let ormId = ormLayer.textureId;

          let diffuseTexture = textures[diffuseId];
          let ormTexture = textures[ormId];
          let tcTexture = teamColors[instance.teamColor];

          let actualDiffuseTexture = textureOverrides.get(diffuseId) || diffuseTexture.texture;
          let actualOrmTexture = textureOverrides.get(ormId) || ormTexture.texture;

          webgl.bindTextureAndWrap(actualDiffuseTexture, 0, diffuseTexture.wrapS, diffuseTexture.wrapT);
          webgl.bindTextureAndWrap(actualOrmTexture, 1, ormTexture.wrapS, ormTexture.wrapT);
          webgl.bindTextureAndWrap(tcTexture.texture, 2, tcTexture.wrapS, tcTexture.wrapT);

          geoset.bindHd(shader, diffuseLayer.coordId);
          geoset.render();
        }
      }
    } else {
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
          let textureIndex = layerTextures[layerIndex];
          let layerTexture = textures[textureIndex];
          let uvAnim = uvAnims[layerIndex];

          gl.uniform4fv(uniforms.u_geosetColor, geosetColor);

          gl.uniform1f(uniforms.u_layerAlpha, layerAlpha);

          gl.uniform2f(uniforms.u_uvTrans, uvAnim[0], uvAnim[1]);
          gl.uniform2f(uniforms.u_uvRot, uvAnim[2], uvAnim[3]);
          gl.uniform1f(uniforms.u_uvScale, uvAnim[4]);

          layer.bind(shader);

          let texture: Texture | null | undefined = textureOverrides.get(textureIndex);

          if (!texture) {
            let replaceable = layerTexture.replaceableId;
            let mdxTexture;

            if (replaceable === 1) {
              mdxTexture = teamColors[instance.teamColor];
            } else if (replaceable === 2) {
              mdxTexture = teamGlows[instance.teamColor];
            } else {
              mdxTexture = layerTexture;
            }

            if (mdxTexture) {
              texture = mdxTexture.texture;
            }
          }

          webgl.bindTextureAndWrap(texture, 0, layerTexture.wrapS, layerTexture.wrapT);

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
