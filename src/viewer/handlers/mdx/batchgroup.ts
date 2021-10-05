import Scene from '../../scene';
import Texture from '../../texture';
import MdxModel from './model';
import MdxModelInstance from './modelinstance';
import Material from './material';
import mdxHandler, { MdxHandlerObject } from './handler';
import { SkinningType } from './batch';

/**
 * A group of batches that are going to be rendered together.
 */
export default class BatchGroup {
  model: MdxModel;
  skinningType: SkinningType;
  isHd: boolean;
  objects: number[] = [];

  constructor(model: MdxModel, skinningType: SkinningType, isHd: boolean) {
    this.model = model;
    this.skinningType = skinningType;
    this.isHd = isHd;
  }

  render(instance: MdxModelInstance): void {
    const scene = <Scene>instance.scene;
    const camera = scene.camera;
    const textureOverrides = instance.textureOverrides;
    const layerAlphas = instance.layerAlphas;
    const model = this.model;
    const textures = model.textures;
    const batches = model.batches;
    const viewer = model.viewer;
    const mdxCache = <MdxHandlerObject>viewer.sharedCache.get('mdx');
    const gl = viewer.gl;
    const webgl = viewer.webgl;
    const skinningType = this.skinningType;
    const isHd = this.isHd;
    const teamColors = mdxCache.teamColors;
    const teamGlows = mdxCache.teamGlows;
    const shader = mdxHandler.getBatchShader(viewer, skinningType, isHd);

    shader.use();

    const uniforms = shader.uniforms;

    gl.uniformMatrix4fv(uniforms['u_VP'], false, camera.viewProjectionMatrix);

    const boneTexture = instance.boneTexture;

    // Instances of models with no bones don't have a bone texture.
    if (boneTexture) {
      boneTexture.bind(15);

      gl.uniform1f(uniforms['u_hasBones'], 1);
      gl.uniform1i(uniforms['u_boneMap'], 15);
      gl.uniform1f(uniforms['u_vectorSize'], 1 / boneTexture.width);
      gl.uniform1f(uniforms['u_rowSize'], 1);
    } else {
      gl.uniform1f(uniforms['u_hasBones'], 0);
    }

    gl.uniform3fv(uniforms['u_lightPos'], scene.lightPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.arrayBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);

    if (isHd) {
      gl.uniform1i(uniforms['u_diffuseMap'], 0);
      gl.uniform1i(uniforms['u_normalsMap'], 1);
      gl.uniform1i(uniforms['u_ormMap'], 2);
      gl.uniform1i(uniforms['u_emissiveMap'], 3);
      gl.uniform1i(uniforms['u_teamColorMap'], 4);
      gl.uniform1i(uniforms['u_environmentMap'], 5);

      // gl.uniform1i(uniforms['u_lutMap'], 6);
      // gl.uniform1i(uniforms['u_envDiffuseMap'], 7);
      // gl.uniform1i(uniforms['u_envSpecularMap'], 8);

      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);

      gl.uniformMatrix4fv(uniforms['u_MV'], false, camera.viewMatrix);

      gl.uniform3fv(uniforms['u_eyePos'], camera.location);

      for (const index of this.objects) {
        const batch = batches[index];
        const geoset = batch.geoset;
        const material = <Material>batch.material;
        const [diffuseLayer, normalsLayer, ormLayer, emissiveLayer, teamColorLayer, environmentMapLayer] = material.layers;
        const layerAlpha = layerAlphas[diffuseLayer.index];

        if (layerAlpha > 0) {
          gl.uniform1f(uniforms['u_layerAlpha'], layerAlpha);
          gl.uniform1f(uniforms['u_filterMode'], diffuseLayer.filterMode);

          const diffuseId = diffuseLayer.textureId;
          const normalsId = normalsLayer.textureId;
          const ormId = ormLayer.textureId;
          const emissiveId = emissiveLayer.textureId;
          const teamColorId = teamColorLayer.textureId;
          const environmentMapId = environmentMapLayer.textureId;

          const diffuseTexture = textures[diffuseId];
          const normalsTexture = textures[normalsId];
          const ormTexture = textures[ormId];
          const emissiveTexture = textures[emissiveId];
          let teamColorTexture = textures[teamColorId];
          const environmentMapTexture = textures[environmentMapId];

          if (teamColorTexture.replaceableId === 0 || teamColorTexture.replaceableId === 1) {
            teamColorTexture = teamColors[instance.teamColor];
          }
          
          const actualDiffuseTexture = textureOverrides.get(diffuseId) || diffuseTexture.texture;
          const actualNormalsTexture = textureOverrides.get(normalsId) || normalsTexture.texture;
          const actualOrmTexture = textureOverrides.get(ormId) || ormTexture.texture;
          const actualEmissiveTexture = textureOverrides.get(emissiveId) || emissiveTexture.texture;
          const actualTeamColorTexture = textureOverrides.get(teamColorId) || teamColorTexture.texture;
          const actualEnvironmentMapTexture = textureOverrides.get(environmentMapId) || environmentMapTexture.texture;

          webgl.bindTextureAndWrap(actualDiffuseTexture, 0, diffuseTexture.wrapS, diffuseTexture.wrapT);
          webgl.bindTextureAndWrap(actualNormalsTexture, 1, normalsTexture.wrapS, normalsTexture.wrapT);
          webgl.bindTextureAndWrap(actualOrmTexture, 2, ormTexture.wrapS, ormTexture.wrapT);
          webgl.bindTextureAndWrap(actualEmissiveTexture, 3, emissiveTexture.wrapS, emissiveTexture.wrapT);
          webgl.bindTextureAndWrap(actualTeamColorTexture, 4, teamColorTexture.wrapS, teamColorTexture.wrapT);
          webgl.bindTextureAndWrap(actualEnvironmentMapTexture, 5, environmentMapTexture.wrapS, environmentMapTexture.wrapT);

          // const { lutTexture, envDiffuseTexture, envSpecularTexture }= mdxCache;
          // if (lutTexture && envDiffuseTexture && envSpecularTexture) {
          //   webgl.bindTextureAndWrap(lutTexture.texture, 6, lutTexture.wrapS, lutTexture.wrapT);
          //   webgl.bindTextureAndWrap(envDiffuseTexture.texture, 7, envDiffuseTexture.wrapS, envDiffuseTexture.wrapT);
          //   webgl.bindTextureAndWrap(envSpecularTexture.texture, 8, envSpecularTexture.wrapS, envSpecularTexture.wrapT);
          // }

          geoset.bindHd(shader, batch.skinningType, diffuseLayer.coordId);
          geoset.render();
        }
      }
    } else {
      const geosetColors = instance.geosetColors;
      const layerTextures = instance.layerTextures;
      const uvAnims = instance.uvAnims;

      gl.uniform4fv(uniforms['u_vertexColor'], instance.vertexColor);
      gl.uniform1i(uniforms['u_texture'], 0);
      
      for (const object of this.objects) {
        const batch = batches[object];
        const geoset = batch.geoset;
        const layer = batch.layer;
        const geosetIndex = geoset.index;
        const layerIndex = layer.index;
        const geosetColor = geosetColors[geosetIndex];
        const layerAlpha = layerAlphas[layerIndex];

        if (geosetColor[3] > 0.01 && layerAlpha > 0.01) {
          const textureIndex = layerTextures[layerIndex];
          const layerTexture = textures[textureIndex];
          const uvAnim = uvAnims[layerIndex];

          gl.uniform4fv(uniforms['u_geosetColor'], geosetColor);

          gl.uniform1f(uniforms['u_layerAlpha'], layerAlpha);
          gl.uniform1f(uniforms['u_unshaded'], layer.unshaded);

          gl.uniform2f(uniforms['u_uvTrans'], uvAnim[0], uvAnim[1]);
          gl.uniform2f(uniforms['u_uvRot'], uvAnim[2], uvAnim[3]);
          gl.uniform1f(uniforms['u_uvScale'], uvAnim[4]);

          layer.bind(shader);

          let texture: Texture | null | undefined = textureOverrides.get(textureIndex);

          if (!texture) {
            const replaceable = layerTexture.replaceableId;
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

          if (skinningType === SkinningType.ExtendedVertexGroups) {
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
