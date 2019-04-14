import {vec3} from 'gl-matrix';
import {VEC3_ONE} from '../../../common/gl-matrix-addon';

/**
 * A shallow geoset.
 */
export class ShallowGeoset {
  /**
   * @param {MdxModel} model
   * @param {Array<number>} offsets
   * @param {number} uvSetSize
   * @param {Uint16Array} elements
   */
  constructor(model, offsets, uvSetSize, elements) {
    this.model = model;
    this.offsets = offsets;
    this.uvSetSize = uvSetSize;
    this.elements = elements;
  }

  /**
   * @param {ShaderProgram} shader
   * @param {number} coordId
   */
  bind(shader, coordId) {
    let gl = this.model.viewer.gl;
    let offsets = this.offsets;
    let attribs = shader.attribs;

    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 12, offsets[0]);
    gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 12, offsets[1]);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 8, offsets[2] + coordId * this.uvSetSize);
    gl.vertexAttribPointer(attribs.a_bones, 4, gl.UNSIGNED_BYTE, false, 4, offsets[3]);
    gl.vertexAttribPointer(attribs.a_boneNumber, 1, gl.UNSIGNED_BYTE, false, 4, offsets[4]);
  }

  /**
   * @param {number} instances
   */
  render(instances) {
    let gl = this.model.viewer.gl;

    gl.extensions.instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.offsets[5], instances);
  }
}

/**
 * A geoset.
 */
export class Geoset {
  /**
   * @param {MdxModel} model
   * @param {MdxParserGeoset} geoset
   * @param {number} index
   */
  constructor(model, geoset, index) {
    let positions = geoset.vertices;
    let normals = geoset.normals;
    let textureCoordinateSets = geoset.uvSets;
    let uvsetSize = textureCoordinateSets[0].length;
    let vertices = positions.length / 3;
    let uvs;
    let boneIndices = new Uint8Array(vertices * 4);
    // A note for the future, since I keep coming back to this.
    // The reason bone numbers are stored as 32 bits instead of 8 are because of offset rules.
    // WebGL complains if the bind() method of ShallowGeoset above uses offset 1 instead of 4, even if the shader gets one float.
    // Why? heck if I know.
    // I don't see the alignment issues, but WebGL does.
    let boneNumbers = new Uint32Array(vertices);
    let vertexGroups = geoset.vertexGroups;
    let matrixGroups = geoset.matrixGroups;
    let matrixIndices = geoset.matrixIndices;
    let slices = [];

    // Make one typed array for the texture coordinates, in case there are multiple ones
    if (textureCoordinateSets.length > 1) {
      uvs = new Float32Array(textureCoordinateSets.length * uvsetSize);

      for (let i = 0, l = textureCoordinateSets.length; i < l; i++) {
        uvs.set(textureCoordinateSets[i], i * uvsetSize);
      }
    } else {
      uvs = textureCoordinateSets[0];
    }

    // Parse the bone indices by slicing the matrix groups
    for (let i = 0, l = matrixGroups.length, k = 0; i < l; i++) {
      slices.push(matrixIndices.subarray(k, k + matrixGroups[i]));
      k += matrixGroups[i];
    }

    // Construct the final bone arrays
    for (let i = 0; i < vertices; i++) {
      let slice = slices[vertexGroups[i]];

      // Somehow in some bad models a vertex group index refers to an invalid matrix group.
      // Such models are still loaded by the game.
      if (slice) {
        let bones = slices[vertexGroups[i]];
        let boneCount = Math.min(bones.length, 4); // The viewer supports up to 4 bones per vertex, the game handles any(?) amount.

        for (let j = 0; j < boneCount; j++) {
          // 1 is added to every index for shader optimization (index 0 is a zero matrix)
          boneIndices[i * 4 + j] = bones[j] + 1;
        }

        boneNumbers[i] = boneCount;
      }
    }

    this.index = index;
    this.materialId = geoset.materialId;
    this.locationArray = positions;
    this.normalArray = normals;
    this.uvsArray = uvs;
    this.boneIndexArray = boneIndices;
    this.boneNumberArray = boneNumbers;
    this.faceArray = geoset.faces;
    this.uvSetSize = uvsetSize * 4;

    let geosetAnimations = model.geosetAnimations;

    for (let i = 0, l = geosetAnimations.length; i < l; i++) {
      if (geosetAnimations[i].geosetId === index) {
        this.geosetAnimation = geosetAnimations[i];
      }
    }

    let variants = {
      alpha: [],
      color: [],
    };

    let hasAnim = false;

    for (let i = 0, l = model.sequences.length; i < l; i++) {
      let alpha = this.isAlphaVariant(i);
      let color = this.isColorVariant(i);

      if (alpha || color) {
        hasAnim = true;
      }

      variants.alpha[i] = alpha;
      variants.color[i] = color;
    }

    this.variants = variants;
    this.hasAnim = hasAnim;
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
   * @param {number} sequence
   * @return {boolean}
   */
  isAlphaVariant(sequence) {
    return this.geosetAnimation && this.geosetAnimation.isAlphaVariant(sequence);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isColorVariant(sequence) {
    return this.geosetAnimation && this.geosetAnimation.isColorVariant(sequence);
  }
}
