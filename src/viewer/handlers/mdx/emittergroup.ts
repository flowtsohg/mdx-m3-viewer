import ShaderProgram from '../../gl/program';
import Scene from '../../scene';
import MdxModel from './model';
import MdxModelInstance from './modelinstance';
import { renderEmitter } from './geometryemitterfuncs';

/**
 * A group of emitters that are going to be rendered together.
 */
export default class EmitterGroup {
  model: MdxModel;
  objects: number[] = [];

  constructor(model: MdxModel) {
    this.model = model;
  }

  render(instance: MdxModelInstance) {
    let scene = <Scene>instance.scene;
    let nodes = instance.nodes;
    let model = instance.model;
    let viewer = model.viewer;
    let gl = viewer.gl;
    let instancedArrays = <ANGLE_instanced_arrays>viewer.webgl.extensions.ANGLE_instanced_arrays;
    let mdxCache = viewer.sharedCache.get('mdx');
    let shader = <ShaderProgram>mdxCache.particlesShader;
    let uniforms = shader.uniforms;
    let attribs = shader.attribs;
    let rectBuffer = <WebGLBuffer>mdxCache.rectBuffer;

    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    shader.use();

    gl.uniformMatrix4fv(uniforms.u_VP, false, scene.camera.viewProjectionMatrix);
    gl.uniform1i(uniforms.u_texture, 0);

    instancedArrays.vertexAttribDivisorANGLE(attribs.a_position, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.vertexAttribPointer(attribs.a_position, 1, gl.UNSIGNED_BYTE, false, 0, 0);

    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p0, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p1, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p2, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p3, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_health, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_color, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_tail, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_leftRightTop, 1);

    for (let index of this.objects) {
      renderEmitter(nodes[index].object, shader);
    }

    instancedArrays.vertexAttribDivisorANGLE(attribs.a_leftRightTop, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_tail, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_color, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_health, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p3, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p2, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p1, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p0, 0);
  }
}
