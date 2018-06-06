import M3Layer from './layer';

/**
 * An M3 standard material.
 */
export default class M3StandardMaterial {
  /**
   * @param {M3Model} model
   * @param {M3ParserStandardMaterial} material
   */
  constructor(model, material) {
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

  /**
   *
   */
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
    gl.depthMask(1);
  }

  /**
   * @param {Bucket} bucket
   * @param {ShaderProgram} shader
   */
  bind(bucket, shader) {
    const gl = this.gl;

    this.bindCommon();

    gl.uniform1f(shader.uniforms.get('u_specularity'), this.specularity);
    gl.uniform1f(shader.uniforms.get('u_specMult'), this.specMult);
    gl.uniform1f(shader.uniforms.get('u_emisMult'), this.emisMult);
    gl.uniform4fv(shader.uniforms.get('u_lightAmbient'), [0.02, 0.02, 0.02, 0]);

    const layers = this.layers;

    layers[0].bind(bucket, shader);
    layers[1].bind(bucket, shader);
    layers[2].bind(bucket, shader);
    layers[4].bind(bucket, shader);
    layers[5].bind(bucket, shader);
    layers[10].bind(bucket, shader);
    layers[12].bind(bucket, shader);
  }

  /**
   * @param {ShaderProgram} shader
   */
  unbind(shader) {
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

  /**
   * @param {ShaderProgram} shader
   */
  bindDiffuse(shader) {
    this.bindCommon();

    this.layers[0].bind(shader);
  }

  /**
   * @param {ShaderProgram} shader
   */
  bindSpecular(shader) {
    const gl = this.gl;

    this.bindCommon();

    gl.uniform1f(shader.uniforms.get('u_specularity'), this.specularity);
    gl.uniform1f(shader.uniforms.get('u_specMult'), this.specMult);

    this.layers[2].bind(shader);
  }

  /**
   * @param {ShaderProgram} shader
   */
  bindNormalMap(shader) {
    this.bindCommon();

    this.layers[10].bind(shader);
  }

  /**
   * @param {ShaderProgram} shader
   */
  bindEmissive(shader) {
    this.bindCommon();

    this.gl.uniform1f(shader.uniforms.get('u_emisMult'), this.emisMult);

    this.layers[4].bind(shader);
    this.layers[5].bind(shader);
  }

  /**
   * @param {ShaderProgram} shader
   */
  bindDecal(shader) {
    this.bindCommon();

    this.layers[1].bind(shader);
  }
}
