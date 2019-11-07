import {renderEmitter} from './geometryemitterfuncs';

/**
 * A group of emitters that are going to be rendered together.
 */
export default class EmitterGroup {
  /**
   * @param {Model} model
   */
  constructor(model) {
    /** @member {Model} */
    this.model = model;
    /** @member {Array<number>} */
    this.objects = [];
  }

  /**
   * @param {ModelInstance} instance
   */
  render(instance) {
    let nodes = instance.nodes;
    let model = instance.model;
    let viewer = model.viewer;
    let gl = viewer.gl;
    let instancedArrays = gl.extensions.instancedArrays;
    let shader = model.handler.particleShader;
    let uniforms = shader.uniforms;
    let attribs = shader.attribs;

    gl.depthMask(0);
    gl.enable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    viewer.webgl.useShaderProgram(shader);

    gl.uniformMatrix4fv(uniforms.u_mvp, false, instance.scene.camera.worldProjectionMatrix);
    gl.uniform1i(uniforms.u_texture, 0);

    instancedArrays.vertexAttribDivisorANGLE(attribs.a_position, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, viewer.rectBuffer);
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
