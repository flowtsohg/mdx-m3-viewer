import Shader from '../../gl/shader';
import MdxModel from './model';
import GeosetAnimation from './geosetanimation';
import { SkinningType } from './batch';

/**
 * A geoset.
 */
export default class Geoset {
  model: MdxModel;
  index: number;
  positionOffset: number;
  normalOffset: number;
  uvOffset: number;
  tangentOffset: number;
  skinOffset: number;
  faceOffset: number;
  vertices: number;
  elements: number;
  faceType: number;
  geosetAnimation: GeosetAnimation | null = null;

  constructor(model: MdxModel, index: number, positionOffset: number, normalOffset: number, uvOffset: number, tangentOffset: number, skinOffset: number, faceOffset: number, vertices: number, elements: number, faceType: number) {
    this.model = model;
    this.index = index;
    this.positionOffset = positionOffset;
    this.normalOffset = normalOffset;
    this.uvOffset = uvOffset;
    this.tangentOffset = tangentOffset;
    this.skinOffset = skinOffset;
    this.faceOffset = faceOffset;
    this.vertices = vertices;
    this.elements = elements;
    this.faceType = faceType;

    for (const geosetAnimation of model.geosetAnimations) {
      if (geosetAnimation.geosetId === index) {
        this.geosetAnimation = geosetAnimation;
      }
    }
  }

  bindShared(gl: WebGLRenderingContext, attribs: {[key: string]: number }, coordId: number): void {
    gl.vertexAttribPointer(attribs['a_position'], 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs['a_normal'], 3, gl.FLOAT, false, 0, this.normalOffset);
    gl.vertexAttribPointer(attribs['a_uv'], 2, gl.FLOAT, false, 0, this.uvOffset + coordId * this.vertices * 8);
  }

  bindVertexGroups(gl: WebGLRenderingContext, attribs: {[key: string]: number }): void {
    const model = this.model;
    const skinDataType = model.skinDataType;
    const bytesPerSkinElement = model.bytesPerSkinElement;

    gl.vertexAttribPointer(attribs['a_bones'], 4, skinDataType, false, 5 * bytesPerSkinElement, this.skinOffset);
    gl.vertexAttribPointer(attribs['a_boneNumber'], 1, skinDataType, false, 5 * bytesPerSkinElement, this.skinOffset + 4 * bytesPerSkinElement);
  }

  bindVertexGroupsExtended(gl: WebGLRenderingContext, attribs: {[key: string]: number }): void {
    const model = this.model;
    const skinDataType = model.skinDataType;
    const bytesPerSkinElement = model.bytesPerSkinElement;

    gl.vertexAttribPointer(attribs['a_bones'], 4, skinDataType, false, 9 * bytesPerSkinElement, this.skinOffset);
    gl.vertexAttribPointer(attribs['a_extendedBones'], 4, skinDataType, false, 9 * bytesPerSkinElement, this.skinOffset + 4 * bytesPerSkinElement);
    gl.vertexAttribPointer(attribs['a_boneNumber'], 1, skinDataType, false, 9 * bytesPerSkinElement, this.skinOffset + 8 * bytesPerSkinElement);
  }

  bindSkin(gl: WebGLRenderingContext, attribs: {[key: string]: number }): void {
    gl.vertexAttribPointer(attribs['a_bones'], 4, gl.UNSIGNED_BYTE, false, 8, this.skinOffset);
    gl.vertexAttribPointer(attribs['a_weights'], 4, gl.UNSIGNED_BYTE, true, 8, this.skinOffset + 4);
  }

  bind(shader: Shader, coordId: number): void {
    const gl = this.model.viewer.gl;
    const attribs = shader.attribs;

    this.bindShared(gl, attribs, coordId);
    this.bindVertexGroups(gl, attribs);
  }

  bindExtended(shader: Shader, coordId: number): void{
    const gl = this.model.viewer.gl;
    const attribs = shader.attribs;

    this.bindShared(gl, attribs, coordId);
    this.bindVertexGroupsExtended(gl, attribs);
  }

  bindHd(shader: Shader, skinningType: SkinningType, coordId: number): void {
    const gl = this.model.viewer.gl;
    const attribs = shader.attribs;

    this.bindShared(gl, attribs, coordId);

    gl.vertexAttribPointer(attribs['a_tangent'], 4, gl.FLOAT, false, 0, this.tangentOffset);

    if (skinningType === SkinningType.Skin) {
      this.bindSkin(gl, attribs);
    } else if (skinningType === SkinningType.ExtendedVertexGroups) {
      this.bindVertexGroupsExtended(gl, attribs);
    } else {
      this.bindVertexGroups(gl, attribs);
    }
  }

  render(): void {
    const gl = this.model.viewer.gl;

    gl.drawElements(this.faceType, this.elements, gl.UNSIGNED_SHORT, this.faceOffset);
  }
}
