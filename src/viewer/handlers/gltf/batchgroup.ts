import { mat4 } from 'gl-matrix';
import ShaderProgram from '../../gl/program';
import Scene from '../../scene';
import gltfHandler from './handler';
import GltfModel from './model';
import GltfInstance from './modelinstance';

const mat4Heap = mat4.create();

/**
 * A group of batches that are going to be rendered together.
 */
export default class GltfBatchGroup {
  model: GltfModel;
  objects: number[] = [];
  primitiveFlags: number;
  materialFlags: number;
  shader: ShaderProgram;

  constructor(model: GltfModel, primitiveFlags: number, materialFlags: number) {
    this.model = model;
    this.primitiveFlags = primitiveFlags;
    this.materialFlags = materialFlags;
    this.shader = gltfHandler.getShader(this);
  }

  render(instance: GltfInstance) {
    let scene = <Scene>instance.scene;
    let textureMapper = instance.textureMapper;
    let model = this.model;
    let viewer = model.viewer;
    let gl = viewer.gl;
    let webgl = viewer.webgl;
    let batches = model.batches;
    let shader = this.shader;
    let uniforms = shader.uniforms;

    shader.use();

    // Camera.
    gl.uniformMatrix4fv(uniforms.u_viewProjectionMatrix, false, scene.camera.worldProjectionMatrix);
    gl.uniform3fv(uniforms.u_camera, scene.camera.location);

    // Environment.
    gl.uniform1i(uniforms.u_hasEnvSamplers, gltfHandler.env.hasTextures);

    webgl.bindCubeMap(gltfHandler.env.diffuseTexture, 0);
    gl.uniform1i(uniforms.u_diffuseEnvSampler, 0);

    webgl.bindCubeMap(gltfHandler.env.specularTexture, 1);
    gl.uniform1i(uniforms.u_specularEnvSampler, 1);

    webgl.bindTexture(gltfHandler.env.brdfLUTTexture, 2);
    gl.uniform1i(uniforms.u_brdfLUT, 2);

    gl.uniform1i(uniforms.u_mipCount, 9);

    // Tonemapping.
    gl.uniform1f(uniforms.u_exposure, 1);

    for (let object of this.objects) {
      let batch = batches[object];
      let node = instance.nodes[batch.node];
      let primitive = batch.primitive;
      let material = batch.material;

      gl.uniformMatrix4fv(uniforms.u_modelMatrix, false, node.worldMatrix);

      // transpose(invert(mv))
      mat4.mul(mat4Heap, scene.camera.worldMatrix, node.worldMatrix);
      mat4.invert(mat4Heap, mat4Heap);
      mat4.transpose(mat4Heap, mat4Heap);
      gl.uniformMatrix4fv(uniforms.u_normalMatrix, false, mat4Heap);

      material.bind(shader, textureMapper);
      primitive.render(shader);
    }
  }
}
