import {vec3} from 'gl-matrix';
import {VEC3_ONE} from '../../../common/gl-matrix-addon';

/**
 * A geoset.
 */
export default class Geoset {
  /**
   * @param {Model} model
   * @param {number} index
   * @param {number} positionOffset
   * @param {number} normalOffset
   * @param {number} uvOffset
   * @param {number} skinOffset
   * @param {number} faceOffset
   * @param {number} vertices
   * @param {number} elements
   */
  constructor(model, index, positionOffset, normalOffset, uvOffset, skinOffset, faceOffset, vertices, elements) {
    this.model = model;
    this.index = index;
    this.positionOffset = positionOffset;
    this.normalOffset = normalOffset;
    this.uvOffset = uvOffset;
    this.skinOffset = skinOffset;
    this.faceOffset = faceOffset;
    this.vertices = vertices;
    this.elements = elements;

    let geosetAnimations = model.geosetAnimations;

    for (let i = 0, l = geosetAnimations.length; i < l; i++) {
      if (geosetAnimations[i].geosetId === index) {
        this.geosetAnimation = geosetAnimations[i];
      }
    }

    for (let geosetAnimation of model.geosetAnimations) {
      if (geosetAnimation.geosetId === index) {
        this.geosetAnimation = geosetAnimation;
      }
    }

    let variants = {
      alpha: [],
      color: [],
      object: [],
    };

    let geosetAnimation = this.geosetAnimation;
    let hasAlphaAnim = false;
    let hasColorAnim = false;

    if (geosetAnimation) {
      for (let i = 0, l = model.sequences.length; i < l; i++) {
        let alpha = geosetAnimation.isAlphaVariant(i);
        let color = geosetAnimation.isColorVariant(i);

        variants.alpha[i] = alpha;
        variants.color[i] = color;
        variants.object[i] = alpha || color;

        hasAlphaAnim = hasAlphaAnim || alpha;
        hasColorAnim = hasColorAnim || color;
      }
    } else {
      for (let i = 0, l = model.sequences.length; i < l; i++) {
        variants.alpha[i] = false;
        variants.color[i] = false;
        variants.object[i] = false;
      }
    }

    this.variants = variants;
    this.hasAlphaAnim = hasAlphaAnim;
    this.hasColorAnim = hasColorAnim;
    this.hasObjectAnim = hasAlphaAnim || hasColorAnim;
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAlpha(out, instance) {
    if (this.geosetAnimation) {
      return this.geosetAnimation.getAlpha(out, instance);
    }

    out[0] = 1;
    return -1;
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getColor(out, instance) {
    if (this.geosetAnimation) {
      return this.geosetAnimation.getColor(out, instance);
    }

    vec3.copy(out, VEC3_ONE);
    return -1;
  }

  /**
   * @param {ShaderProgram} shader
   * @param {number} coordId
   */
  bind(shader, coordId) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, this.normalOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset + coordId * this.vertices * 8);
    gl.vertexAttribPointer(attribs.a_bones, 4, gl.UNSIGNED_BYTE, false, 5, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_boneNumber, 1, gl.UNSIGNED_BYTE, false, 5, this.skinOffset + 4);
  }

  /**
   * @param {ShaderProgram} shader
   * @param {number} coordId
   */
  bindExtended(shader, coordId) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, this.normalOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset + coordId * this.vertices * 8);
    gl.vertexAttribPointer(attribs.a_bones, 4, gl.UNSIGNED_BYTE, false, 9, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_extendedBones, 4, gl.UNSIGNED_BYTE, false, 9, this.skinOffset + 4);
    gl.vertexAttribPointer(attribs.a_boneNumber, 1, gl.UNSIGNED_BYTE, false, 9, this.skinOffset + 8);
  }

  /**
   *
   */
  render() {
    let gl = this.model.viewer.gl;

    gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.faceOffset);
  }

  /**
   * @param {ShaderProgram} shader
   */
  bindSimple(shader) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset);
  }

  /**
   * @param {number} instances
   */
  renderSimple(instances) {
    let gl = this.model.viewer.gl;

    gl.extensions.instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.faceOffset, instances);
  }

  /**
   * @param {ShaderProgram} shader
   * @param {number} coordId
   */
  bindHd(shader, coordId) {
    let gl = this.model.viewer.gl;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 0, this.positionOffset);
    gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 0, this.normalOffset);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, this.uvOffset + coordId * this.vertices * 8);
    gl.vertexAttribPointer(attribs.a_bones, 4, gl.UNSIGNED_BYTE, false, 8, this.skinOffset);
    gl.vertexAttribPointer(attribs.a_weights, 4, gl.UNSIGNED_BYTE, true, 8, this.skinOffset + 4);
  }
}
