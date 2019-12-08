import M3ParserStandardMaterial from '../../../parsers/m3/standardmaterial';
import ShaderProgram from '../../gl/program';
import TextureMapper from '../../texturemapper';
import M3Model from './model';
import M3Layer from './layer';

/**
 * An M3 standard material.
 */
export default class M3StandardMaterial {
  model: M3Model;
  gl: WebGLRenderingContext;
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

  constructor(model: M3Model, material: M3ParserStandardMaterial) {
    this.model = model;
    this.gl = model.viewer.gl;

    this.name = material.name.getAll().join('');
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
      new M3Layer(this, material.diffuseLayer, 'diffuse', 2),
      new M3Layer(this, material.decalLayer, 'decal', 2),
      new M3Layer(this, material.specularLayer, 'specular', 2),
      new M3Layer(this, material.glossLayer, 'gloss', 2),
      new M3Layer(this, material.emissiveLayer, 'emissive', material.emisBlendType),
      new M3Layer(this, material.emissive2Layer, 'emissive2', material.emisMode),
      new M3Layer(this, material.evioLayer, 'evio', 2),
      new M3Layer(this, material.evioMaskLayer, 'evioMask', 2),
      new M3Layer(this, material.alphaMaskLayer, 'alphaMask', 2),
      new M3Layer(this, material.alphaMask2Layer, 'alphaMask2', 2),
      new M3Layer(this, material.normalLayer, 'normal', 2),
      new M3Layer(this, material.heightLayer, 'heightMap', 2),
      new M3Layer(this, material.lightMapLayer, 'lightMap', 2),
      new M3Layer(this, material.ambientOcclusionLayer, 'ao', 2),
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

  bind(shader: ShaderProgram, textureMapper: TextureMapper) {
    const gl = this.gl;

    this.bindCommon();

    gl.uniform1f(shader.uniforms.u_specularity, this.specularity);
    gl.uniform1f(shader.uniforms.u_specMult, this.specMult);
    gl.uniform1f(shader.uniforms.u_emisMult, this.emisMult);
    gl.uniform4f(shader.uniforms.u_lightAmbient, 0.02, 0.02, 0.02, 0);

    const layers = this.layers;

    layers[0].bind(shader, textureMapper);
    layers[1].bind(shader, textureMapper);
    layers[2].bind(shader, textureMapper);
    layers[4].bind(shader, textureMapper);
    layers[5].bind(shader, textureMapper);
    layers[10].bind(shader, textureMapper);
    layers[12].bind(shader, textureMapper);
  }

  unbind(shader: ShaderProgram) {
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
