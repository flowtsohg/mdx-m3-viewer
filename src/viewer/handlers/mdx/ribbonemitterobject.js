import GenericObject from './genericobject';
import {EMITTER_RIBBON} from './geometryemitterfuncs';

/**
 * An MDX ribbon emitter.
 */
export default class RibbonEmitterObject extends GenericObject {
  /**
   * @param {MdxModel} model
   * @param {MdxParserParticleEmitter} emitter
   * @param {number} index
   */
  constructor(model, emitter, index) {
    super(model, emitter, index);

    this.geometryEmitterType = EMITTER_RIBBON;

    this.layer = model.materials[emitter.materialId].layers[0];
    this.heightAbove = emitter.heightAbove;
    this.heightBelow = emitter.heightBelow;
    this.alpha = emitter.alpha;
    this.color = emitter.color;
    this.lifeSpan = emitter.lifeSpan;
    this.textureSlot = emitter.textureSlot;
    this.emissionRate = emitter.emissionRate;
    this.gravity = emitter.gravity;
    this.columns = emitter.columns;
    this.rows = emitter.rows;
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getHeightBelow(out, instance) {
    return this.getScalarValue(out, 'KRHB', instance, this.heightBelow);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getHeightAbove(out, instance) {
    return this.getScalarValue(out, 'KRHA', instance, this.heightAbove);
  }

  /**
   * @param {Uint32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getTextureSlot(out, instance) {
    return this.getScalarValue(out, 'KRTX', instance, 0);
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getColor(out, instance) {
    return this.getVectorValue(out, 'KRCO', instance, this.color);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAlpha(out, instance) {
    return this.getScalarValue(out, 'KRAL', instance, this.alpha);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVisibility(out, instance) {
    return this.getScalarValue(out, 'KRVS', instance, 1);
  }
}
