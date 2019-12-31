import ShaderProgram from '../../gl/program';
import Scene from '../../scene';
import mdxHandler from './handler';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';
import ReforgedBatch from './reforgedbatch';

/**
 * A group of Reforged batches that are going to be rendered together.
 */
export default class ReforgedBatchGroup {
  model: MdxModel;
  shader: string;
  objects: number[] = [];

  constructor(model: MdxModel, shader: string) {
    this.model = model;
    this.shader = shader;
  }

  render(instance: MdxComplexInstance) {
    let scene = <Scene>instance.scene;
    let textureMapper = instance.textureMapper;
    let boneTexture = instance.boneTexture;
    let layerAlphas = instance.layerAlphas;
    let model = this.model;
    let batches = model.batches;
    let viewer = model.viewer;
    let gl = viewer.gl;
    let webgl = viewer.webgl;
    let textures = model.textures;
    let teamColorTextures = mdxHandler.reforgedTeamColors;
    let shader = <ShaderProgram>mdxHandler.shaders.hd; /// TODO: select the shader.

    shader.use();

    let uniforms = shader.uniforms;

    gl.uniformMatrix4fv(uniforms.u_VP, false, scene.camera.viewProjectionMatrix);

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

    gl.uniform1i(uniforms.u_diffuseMap, 0);
    gl.uniform1i(uniforms.u_ormMap, 1);
    gl.uniform1i(uniforms.u_teamColorMap, 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.arrayBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);

    for (let index of this.objects) {
      let batch = <ReforgedBatch>batches[index];
      let geoset = batch.geoset;
      let material = batch.material;
      let layers = material.layers;
      let diffuseLayer = layers[0];
      let ormLayer = layers[2];
      let layerAlpha = layerAlphas[diffuseLayer.index];

      if (layerAlpha > 0) {
        gl.uniform1f(uniforms.u_layerAlpha, layerAlpha);
        gl.uniform1f(uniforms.u_filterMode, diffuseLayer.filterMode);

        let diffuseTexture = textures[diffuseLayer.textureId];
        let ormTexture = textures[ormLayer.textureId];
        let teamColorTexture = teamColorTextures[instance.teamColor];

        webgl.bindTexture(textureMapper.get(diffuseTexture) || diffuseTexture, 0);
        webgl.bindTexture(textureMapper.get(ormTexture) || ormTexture, 1);
        webgl.bindTexture(textureMapper.get(teamColorTexture) || teamColorTexture, 2);

        geoset.bindHd(shader, diffuseLayer.coordId);
        geoset.render();
      }
    }
  }
}
