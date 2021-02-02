import M3ParserStandardMaterial from '../../../parsers/m3/standardmaterial';
import Shader from '../../gl/shader';
import Texture from '../../texture';
import M3Model from './model';
import M3Layer from './layer';


export const STANDARD_MATERIAL_OFFSET = 100;

/**
 * An M3 standard material.
 */
export class M3StandardMaterial {
  model: M3Model;
  gl: WebGLRenderingContext;
  index: number;
  name: string;
  flags: number;
  blendMode: number;
  priority: number;
  specularity: number;
  specMult: number;
  emisMult: number;
  layerBlendType: number;
  emisBlendType: number;
  emisMode: number;
  doubleSided: number;
  layers: M3Layer[];

  constructor(model: M3Model, index: number, material: M3ParserStandardMaterial) {
    this.model = model;
    this.gl = model.viewer.gl;
    this.index = index;
    this.name = <string>material.name.get();
    this.flags = material.flags;
    this.blendMode = material.blendMode;
    this.priority = material.priority;
    this.specularity = material.specularity;
    this.specMult = material.specMult;
    this.emisMult = material.emisMult;
    this.layerBlendType = material.layerBlendType;
    this.emisBlendType = material.emisBlendType;
    this.emisMode = material.emisMode;
    this.doubleSided = material.flags & 0x8;

    this.layers = [
      new M3Layer(this, 0, material.diffuseLayer, 'diffuse', 2),
      new M3Layer(this, 1, material.decalLayer, 'decal', 2),
      new M3Layer(this, 2, material.specularLayer, 'specular', 2),
      new M3Layer(this, 3, material.glossLayer, 'gloss', 2),
      new M3Layer(this, 4, material.emissiveLayer, 'emissive', material.emisBlendType),
      new M3Layer(this, 5, material.emissive2Layer, 'emissive2', material.emisMode),
      new M3Layer(this, 6, material.evioLayer, 'evio', 2),
      new M3Layer(this, 7, material.evioMaskLayer, 'evioMask', 2),
      new M3Layer(this, 8, material.alphaMaskLayer, 'alphaMask', 2),
      new M3Layer(this, 9, material.alphaMask2Layer, 'alphaMask2', 2),
      new M3Layer(this, 10, material.normalLayer, 'normal', 2),
      new M3Layer(this, 11, material.heightLayer, 'heightMap', 2),
      new M3Layer(this, 12, material.lightMapLayer, 'lightMap', 2),
      new M3Layer(this, 13, material.ambientOcclusionLayer, 'ao', 2),
    ];
  }

  bindCommon() {
    const gl = this.gl;

    if (this.blendMode === 1) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
    } else if (this.blendMode === 2) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
    } else {
      gl.disable(gl.BLEND);
    }

    if (this.doubleSided) {
      gl.disable(gl.CULL_FACE);
    } else {
      gl.enable(gl.CULL_FACE);
    }

    // Flags somewhere?
    // Per layer?
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
  }

  bind(shader: Shader, textureOverrides: Map<number, Texture>) {
    const gl = this.gl;

    this.bindCommon();

    gl.uniform1f(shader.uniforms.u_specularity, this.specularity);
    gl.uniform1f(shader.uniforms.u_specMult, this.specMult);
    gl.uniform1f(shader.uniforms.u_emisMult, this.emisMult);
    gl.uniform4f(shader.uniforms.u_lightAmbient, 0.02, 0.02, 0.02, 0);

    const layers = this.layers;

    layers[0].bind(shader, textureOverrides);
    layers[1].bind(shader, textureOverrides);
    layers[2].bind(shader, textureOverrides);
    layers[4].bind(shader, textureOverrides);
    layers[5].bind(shader, textureOverrides);
    layers[10].bind(shader, textureOverrides);
    layers[12].bind(shader, textureOverrides);
  }

  unbind(shader: Shader) {
    const gl = this.gl;

    gl.disable(gl.BLEND);
    gl.enable(gl.CULL_FACE);

    const layers = this.layers;

    layers[0].unbind(shader);
    layers[1].unbind(shader);
    layers[2].unbind(shader);
    layers[4].unbind(shader);
    layers[5].unbind(shader);
    layers[10].unbind(shader);
    layers[12].unbind(shader);
  }
}
