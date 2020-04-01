import ShaderProgram from '../../gl/program';
import MdxModel from './model';
import GeosetAnimation from './geosetanimation';

/**
 * A geoset.
 */
export default class Geoset {
  model: MdxModel;
  index: number;
  positionOffset: number;
  normalOffset: number;
  uvOffset: number;
  skinOffset: number;
  faceOffset: number;
  vertices: number;
  elements: number;
  geosetAnimation: GeosetAnimation | null = null;

  constructor(model: MdxModel, index: number, positionOffset: number, normalOffset: number, uvOffset: number, skinOffset: number, faceOffset: number, vertices: number, elements: number) {
    this.model = model;
    this.index = index;
    this.positionOffset = positionOffset;
    this.normalOffset = normalOffset;
    this.uvOffset = uvOffset;
    this.skinOffset = skinOffset;
    this.faceOffset = faceOffset;
    this.vertices = vertices;
    this.elements = elements;

    for (let geosetAnimation of model.geosetAnimations) {
      if (geosetAnimation.geosetId === index) {
        this.geosetAnimation = geosetAnimation;
      }
    }
  }

  bind(shader: ShaderProgram, coordId: number) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, this.normalOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset + coordId * this.vertices * 8);
    gl.vertexAttribPointer(attribs.a_bones, 4, gl.UNSIGNED_BYTE, false, 5, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_boneNumber, 1, gl.UNSIGNED_BYTE, false, 5, this.skinOffset + 4);
  }

  bindExtended(shader: ShaderProgram, coordId: number) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, this.normalOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset + coordId * this.vertices * 8);
    gl.vertexAttribPointer(attribs.a_bones, 4, gl.UNSIGNED_BYTE, false, 9, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_extendedBones, 4, gl.UNSIGNED_BYTE, false, 9, this.skinOffset + 4);
    gl.vertexAttribPointer(attribs.a_boneNumber, 1, gl.UNSIGNED_BYTE, false, 9, this.skinOffset + 8);
  }

  render() {
    let gl = this.model.viewer.gl;

    gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.faceOffset);
  }

  bindSimple(shader: ShaderProgram) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset);
  }

  renderSimple(instances: number) {
    let viewer = this.model.viewer;
    let gl = viewer.gl;
    let instancedArrays = <ANGLE_instanced_arrays>viewer.webgl.extensions.ANGLE_instanced_arrays

    instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.faceOffset, instances);
  }

  bindHd(shader: ShaderProgram, coordId: number) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, this.normalOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset + coordId * this.vertices * 8);
    gl.vertexAttribPointer(attribs.a_bones, 4, gl.UNSIGNED_BYTE, false, 8, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_weights, 4, gl.UNSIGNED_BYTE, true, 8, this.skinOffset + 4);
  }
}
