import ShaderProgram from '../../gl/program';
import Scene from '../../scene';
import mdxHandler from './handler';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';
import Batch from './batch';

/**
 * A group of batches that are going to be rendered together.
 */
export default class BatchGroup {
  model: MdxModel;
  isExtended: boolean;
  objects: number[] = [];

  constructor(model: MdxModel, isExtended: boolean) {
    this.model = model;
    this.isExtended = isExtended;
  }

  render(instance: MdxComplexInstance) {
    let scene = <Scene>instance.scene;
    let textureMapper = instance.textureMapper;
    let geosetColors = instance.geosetColors;
    let layerAlphas = instance.layerAlphas;
    let layerTextures = instance.layerTextures;
    let uvAnims = instance.uvAnims;
    let model = this.model;
    let replaceables = model.replaceables;
    let textures = model.textures;
    let teamColors = mdxHandler.teamColors;
    let teamGlows = mdxHandler.teamGlows;
    let batches = model.batches;
    let viewer = model.viewer;
    let gl = viewer.gl;
    let isExtended = this.isExtended;
    let shader;

    if (isExtended) {
      shader = <ShaderProgram>mdxHandler.shaders.extended;
    } else {
      shader = <ShaderProgram>mdxHandler.shaders.complex;
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
      let geosetColor = geosetColors[geosetIndex];
      let layerAlpha = layerAlphas[layerIndex];

      if (geosetColor[3] > 0 && layerAlpha > 0) {
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

        viewer.webgl.bindTexture(texture, 0);

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
