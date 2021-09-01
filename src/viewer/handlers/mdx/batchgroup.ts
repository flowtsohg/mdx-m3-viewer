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
  isExtendedOrUsingSkin: boolean;
  isHd: boolean;
  objects: number[] = [];

  constructor(model: MdxModel, isExtended: boolean, isHd: boolean) {
    this.model = model;
    this.isExtendedOrUsingSkin = isExtended;
    this.isHd = isHd;
  }

  render(instance: MdxModelInstance) {
    const scene = <Scene>instance.scene;
    const textureOverrides = instance.textureOverrides;
    const layerAlphas = instance.layerAlphas;
    const model = this.model;
    const textures = model.textures;
    const batches = model.batches;
    const viewer = model.viewer;
    const mdxCache = viewer.sharedCache.get('mdx');
    const gl = viewer.gl;
    const webgl = viewer.webgl;
    const isExtended = this.isExtendedOrUsingSkin;
    const isHd = this.isHd;
    const teamColors = <MdxTexture[]>mdxCache.teamColors;
    const teamGlows = <MdxTexture[]>mdxCache.teamGlows;
    let shader;

    if (isHd) {
      if (isExtended) {
        shader = <Shader>mdxCache.hdSkinShader;
      } else {
        shader = <Shader>mdxCache.hdVertexGroupShader;
      }
    } else {
      if (isExtended) {
        shader = <Shader>mdxCache.extendedShader;
      } else {
        shader = <Shader>mdxCache.standardShader;
      }
    }

    shader.use();

    const uniforms = shader.uniforms;

    gl.uniformMatrix4fv(uniforms['u_VP'], false, scene.camera.viewProjectionMatrix);

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

    gl.uniform1i(uniforms['u_texture'], 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.arrayBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);

    if (isHd) {
      gl.uniform1i(uniforms['u_diffuseMap'], 0);
      gl.uniform1i(uniforms['u_ormMap'], 1);
      gl.uniform1i(uniforms['u_teamColorMap'], 2);

      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);

      for (const index of this.objects) {
        const batch = batches[index];
        const geoset = batch.geoset;
        const material = <Material>batch.material;
        const layers = material.layers;
        const diffuseLayer = layers[0];
        const ormLayer = layers[2];
        const layerAlpha = layerAlphas[diffuseLayer.index];

        if (layerAlpha > 0) {
          gl.uniform1f(uniforms['u_layerAlpha'], layerAlpha);
          gl.uniform1f(uniforms['u_filterMode'], diffuseLayer.filterMode);

          const diffuseId = diffuseLayer.textureId;
          const ormId = ormLayer.textureId;

          const diffuseTexture = textures[diffuseId];
          const ormTexture = textures[ormId];
          const tcTexture = teamColors[instance.teamColor];

          const actualDiffuseTexture = textureOverrides.get(diffuseId) || diffuseTexture.texture;
          const actualOrmTexture = textureOverrides.get(ormId) || ormTexture.texture;

          webgl.bindTextureAndWrap(actualDiffuseTexture, 0, diffuseTexture.wrapS, diffuseTexture.wrapT);
          webgl.bindTextureAndWrap(actualOrmTexture, 1, ormTexture.wrapS, ormTexture.wrapT);
          webgl.bindTextureAndWrap(tcTexture.texture, 2, tcTexture.wrapS, tcTexture.wrapT);

          geoset.bindHd(shader, batch.isExtendedOrUsingSkin, diffuseLayer.coordId);
          geoset.render();
        }
      }
    } else {
      const geosetColors = instance.geosetColors;
      const layerTextures = instance.layerTextures;
      const uvAnims = instance.uvAnims;

      gl.uniform4fv(uniforms['u_vertexColor'], instance.vertexColor);

      for (const object of this.objects) {
        const batch = <Batch>batches[object];
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
