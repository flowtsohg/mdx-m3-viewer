import { vec3, vec4 } from 'gl-matrix';
import ShaderProgram from '../../gl/program';
import TextureMapper from '../../texturemapper';
import GltfModel from './model';
import { getMaterialFlags } from './flags';

const ALPHA_MODE_OPAQUE = 0;
const ALPHA_MODE_MASK = 1;
const ALPHA_MODE_BLEND = 2;

/**
 * A glTF material.
 */
export default class GltfMaterial {
  model: GltfModel;

  // Double-sided.
  doubleSided: boolean = false;

  // Alpha mode.
  alphaMode: number = 0;
  alphaCutoff: number = 0.5;

  // Metallic-Roughness material.
  metallicRoughness: boolean = false;
  baseColorFactor: vec4 = vec4.fromValues(1, 1, 1, 1);
  baseColorTexture: number = -1;
  baseColorUvSet: number = 0;
  metallicFactor: number = 1;
  roughnessFactor: number = 1;
  metallicRoughnessTexture: number = -1;
  metallicRoughnessUvSet: number = 0;

  // Specular-glossiness material.
  specularGlossiness: boolean = false;
  diffuseFactor: vec3 = vec3.fromValues(1, 1, 1);
  diffuseTexture: number = -1;
  specularFactor: vec3 = vec3.fromValues(1, 1, 1);
  glossinessFactor: number = 1;
  specularGlossinessTexture: number = -1;
  specularGlossinessUvSet: number = 0;

  // Normal map.
  normalScale: number = 1;
  normalTexture: number = -1;
  normalUvSet: number = 0;

  // Occlusion map.
  occlusionStrength: number = 1;
  occlusionTexture: number = -1;
  occlusionUvSet: number = 0;

  // Emissive map.
  emissiveFactor: vec3 = vec3.create();
  emissiveTexture: number = -1;
  emissiveUvSet: number = 0;

  flags: number;

  constructor(model: GltfModel, material: object) {
    this.model = model;

    if (material.doubleSided !== undefined) {
      this.doubleSided = material.doubleSided;
    }

    if (material.alphaMode !== undefined) {
      let alphaMode = material.alphaMode;

      if (alphaMode === 'OPAQUE') {
        this.alphaMode = ALPHA_MODE_OPAQUE;
      } else if (alphaMode === 'MASK') {
        this.alphaMode = ALPHA_MODE_MASK;
      } else if (alphaMode === 'BLEND') {
        this.alphaMode = ALPHA_MODE_BLEND;
      }
    }

    if (material.alphaCutoff !== undefined) {
      this.alphaCutoff = material.alphaCutoff;
    }

    if (material.pbrMetallicRoughness !== undefined) {
      let metallicRoughness = material.pbrMetallicRoughness;

      this.metallicRoughness = true;

      if (metallicRoughness.baseColorFactor !== undefined) {
        vec4.copy(this.baseColorFactor, metallicRoughness.baseColorFactor);
      }

      if (metallicRoughness.baseColorTexture !== undefined) {
        this.baseColorTexture = metallicRoughness.baseColorTexture.index;
      }

      if (metallicRoughness.metallicFactor !== undefined) {
        this.metallicFactor = metallicRoughness.metallicFactor;
      }

      if (metallicRoughness.roughnessFactor !== undefined) {
        this.roughnessFactor = metallicRoughness.roughnessFactor;
      }

      if (metallicRoughness.metallicRoughnessTexture !== undefined) {
        this.metallicRoughnessTexture = metallicRoughness.metallicRoughnessTexture.index;
      }
    }

    if (material.normalScale !== undefined) {
      this.normalScale = material.normalScale;
    }

    if (material.normalTexture !== undefined) {
      this.normalTexture = material.normalTexture.index;
    }

    if (material.occlusionStrength !== undefined) {
      this.occlusionStrength = material.occlusionStrength;
    }

    if (material.occlusionTexture !== undefined) {
      this.occlusionTexture = material.occlusionTexture.index;
    }

    if (material.emissiveFactor !== undefined) {
      vec3.copy(this.emissiveFactor, material.emissiveFactor);
    }

    if (material.emissiveTexture !== undefined) {
      this.emissiveTexture = material.emissiveTexture.index;
    }

    this.flags = getMaterialFlags(this);
  }

  bind(shader: ShaderProgram, textureMapper: TextureMapper) {
    let model = this.model;
    let viewer = model.viewer;
    let gl = viewer.gl;
    let webgl = viewer.webgl;
    let textures = model.textures;
    let uniforms = shader.uniforms;

    // Double-sided.
    if (this.doubleSided) {
      gl.disable(gl.CULL_FACE);
    } else {
      gl.enable(gl.CULL_FACE);
    }

    // Alpha mode.
    if (this.alphaMode === 0) {
      gl.disable(gl.BLEND);
    } else if (this.alphaMode === 1) {
      gl.disable(gl.BLEND);
      gl.uniform1f(uniforms.u_alphaCutoff, this.alphaCutoff);
    } else if (this.alphaMode === 2) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    if (this.metallicRoughness) {
      // Base color.
      gl.uniform4fv(uniforms.u_baseColorFactor, this.baseColorFactor);

      if (this.baseColorTexture !== -1) {
        webgl.bindTexture(textureMapper.get(this.baseColorTexture) || textures[this.baseColorTexture], 3);
        gl.uniform1i(uniforms.u_baseColorSampler, 3);
        gl.uniform1i(uniforms.u_baseColorUvSet, this.baseColorUvSet);
      }

      // Metallic-Roughness.
      gl.uniform1f(uniforms.u_metallicFactor, this.metallicFactor);
      gl.uniform1f(uniforms.u_roughnessFactor, this.roughnessFactor);

      if (this.metallicRoughnessTexture !== -1) {
        webgl.bindTexture(textureMapper.get(this.metallicRoughnessTexture) || textures[this.metallicRoughnessTexture], 4);
        gl.uniform1i(uniforms.u_metallicRoughnessSampler, 4);
        gl.uniform1i(uniforms.u_metallicRoughnessUvSet, this.metallicRoughnessUvSet);
      }
    }

    // Normal map.
    if (this.normalTexture !== -1) {
      gl.uniform1f(uniforms.u_normalScale, this.normalScale);
      webgl.bindTexture(textureMapper.get(this.normalTexture) || textures[this.normalTexture], 5);
      gl.uniform1i(uniforms.u_normalSampler, 5);
      gl.uniform1i(uniforms.u_normalUvSet, this.normalUvSet);
    }

    // Occlusion map.
    if (this.occlusionTexture !== -1) {
      gl.uniform1f(uniforms.u_occlusionStrength, this.occlusionStrength);
      webgl.bindTexture(textureMapper.get(this.occlusionTexture) || textures[this.occlusionTexture], 6);
      gl.uniform1i(uniforms.u_occlusionSampler, 6);
      gl.uniform1i(uniforms.u_occlusionUvSet, this.occlusionUvSet);
    }

    // Emissive map.
    if (this.emissiveTexture !== -1) {
      gl.uniform3fv(uniforms.u_emissiveFactor, this.emissiveFactor);
      webgl.bindTexture(textureMapper.get(this.emissiveTexture) || textures[this.emissiveTexture], 7);
      gl.uniform1i(uniforms.u_emissiveSampler, 7);
      gl.uniform1i(uniforms.u_emissiveUvSet, this.emissiveUvSet);
    }
  }
}
