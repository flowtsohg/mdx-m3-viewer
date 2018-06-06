import {vec3} from 'gl-matrix';
import GenericObject from './genericobject';

// Heap allocations needed for this module.
let colorHeap = vec3.create();

/**
 * An MDX ribbon emitter.
 */
export default class RibbonEmitter extends GenericObject {
  /**
   * @param {MdxModel} model
   * @param {MdxParserParticleEmitter} emitter
   * @param {number} index
   */
  constructor(model, emitter, index) {
    super(model, emitter, index);

    this.layer = model.materials[emitter.materialId][0];
    this.texture = model.textures[this.layer.textureId];

    this.heightAbove = emitter.heightAbove;
    this.heightBelow = emitter.heightBelow;
    this.alpha = emitter.alpha;
    this.color = emitter.color;
    this.lifeSpan = emitter.lifeSpan;
    this.textureSlot = emitter.textureSlot;
    this.emissionRate = emitter.emissionRate;
    this.gravity = emitter.gravity;

    this.dimensions = [emitter.columns, emitter.rows];
    this.cellWidth = 1 / emitter.columns;
    this.cellHeight = 1 / emitter.rows;
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getHeightBelow(instance) {
    return this.getValue('KRHB', instance, this.heightBelow);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getHeightAbove(instance) {
    return this.getValue('KRHA', instance, this.heightAbove);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getTextureSlot(instance) {
    return this.getValue('KRTX', instance, 0);
  }

  /**
   * @param {ModelInstance} instance
   * @return {vec3}
   */
  getColor(instance) {
    return this.getValue3(colorHeap, 'KRCO', instance, this.color);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAlpha(instance) {
    return this.getValue('KRAL', instance, this.alpha);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVisibility(instance) {
    return this.getValue('KRVS', instance, 1);
  }
}
