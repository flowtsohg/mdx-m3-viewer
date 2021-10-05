import Scene from '../../scene';
import MdxModel from './model';
import MdxModelInstance from './modelinstance';
import { GeometryEmitter, renderEmitter } from './geometryemitterfuncs';
import { MdxHandlerObject } from './handler';

/**
 * A group of emitters that are going to be rendered together.
 */
export default class EmitterGroup {
  model: MdxModel;
  objects: number[] = [];

  constructor(model: MdxModel) {
    this.model = model;
  }

  render(instance: MdxModelInstance): void {
    const scene = <Scene>instance.scene;
    const nodes = instance.nodes;
    const model = instance.model;
    const viewer = model.viewer;
    const gl = viewer.gl;
    const instancedArrays = <ANGLE_instanced_arrays>viewer.webgl.extensions['ANGLE_instanced_arrays'];
    const mdxCache = <MdxHandlerObject>viewer.sharedCache.get('mdx');
    const shader = mdxCache.particlesShader;
    const uniforms = shader.uniforms;
    const attribs = shader.attribs;
    const rectBuffer = mdxCache.rectBuffer;

    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    shader.use();

    gl.uniformMatrix4fv(uniforms['u_VP'], false, scene.camera.viewProjectionMatrix);
    gl.uniform1i(uniforms['u_texture'], 0);

    instancedArrays.vertexAttribDivisorANGLE(attribs['a_position'], 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.vertexAttribPointer(attribs['a_position'], 1, gl.UNSIGNED_BYTE, false, 0, 0);

    instancedArrays.vertexAttribDivisorANGLE(attribs['a_p0'], 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_p1'], 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_p2'], 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_p3'], 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_health'], 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_color'], 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_tail'], 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_leftRightTop'], 1);

    for (const index of this.objects) {
      renderEmitter(<GeometryEmitter>nodes[index].object, shader);
    }

    instancedArrays.vertexAttribDivisorANGLE(attribs['a_leftRightTop'], 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_tail'], 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_color'], 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_health'], 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_p3'], 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_p2'], 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_p1'], 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs['a_p0'], 0);
  }
}
