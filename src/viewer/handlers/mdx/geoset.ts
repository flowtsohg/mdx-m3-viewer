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
  skinDataType: number;
  bytesPerSkinElement: number;
  geosetAnimation: GeosetAnimation | null = null;

  constructor(model: MdxModel, index: number, positionOffset: number, normalOffset: number, uvOffset: number, skinOffset: number, faceOffset: number, vertices: number, elements: number, bytesPerSkinElement: number) {
    let gl = model.viewer.gl;

    this.model = model;
    this.index = index;
    this.positionOffset = positionOffset;
    this.normalOffset = normalOffset;
    this.uvOffset = uvOffset;
    this.skinOffset = skinOffset;
    this.faceOffset = faceOffset;
    this.vertices = vertices;
    this.elements = elements;
    this.skinDataType = gl.UNSIGNED_BYTE;
    this.bytesPerSkinElement = bytesPerSkinElement;

    if (bytesPerSkinElement === 2) {
      this.skinDataType = gl.UNSIGNED_SHORT;
    }

    for (let geosetAnimation of model.geosetAnimations) {
      if (geosetAnimation.geosetId === index) {
        this.geosetAnimation = geosetAnimation;
      }
    }
  }

  bindShared(gl: WebGLRenderingContext, attribs: NumberObject, coordId: number) {
    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, this.normalOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset + coordId * this.vertices * 8);
  }

  bind(shader: ShaderProgram, coordId: number) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    this.bindShared(gl, attribs, coordId);

    gl.vertexAttribPointer(attribs.a_bones, 4, this.skinDataType, false, 5 * this.bytesPerSkinElement, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_boneNumber, 1, this.skinDataType, false, 5 * this.bytesPerSkinElement, this.skinOffset + 4 * this.bytesPerSkinElement);
  }

  bindExtended(shader: ShaderProgram, coordId: number) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    this.bindShared(gl, attribs, coordId);

    gl.vertexAttribPointer(attribs.a_bones, 4, this.skinDataType, false, 9 * this.bytesPerSkinElement, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_extendedBones, 4, this.skinDataType, false, 9 * this.bytesPerSkinElement, this.skinOffset + 4 * this.bytesPerSkinElement);
    gl.vertexAttribPointer(attribs.a_boneNumber, 4, this.skinDataType, false, 9 * this.bytesPerSkinElement, this.skinOffset + 8 * this.bytesPerSkinElement);
  }

  bindHd(shader: ShaderProgram, coordId: number) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    this.bindShared(gl, attribs, coordId);

    gl.vertexAttribPointer(attribs.a_bones, 4, gl.UNSIGNED_BYTE, false, 8, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_weights, 4, gl.UNSIGNED_BYTE, true, 8, this.skinOffset + 4);
  }

  render() {
    let gl = this.model.viewer.gl;

    gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.faceOffset);
  }
}
