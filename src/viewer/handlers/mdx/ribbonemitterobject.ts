import RibbonEmitter from '../../../parsers/mdlx/ribbonemitter';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';
import GenericObject from './genericobject';
import Layer from './layer';
import { EMITTER_RIBBON } from './geometryemitterfuncs';

/**
 * An MDX ribbon emitter.
 */
export default class RibbonEmitterObject extends GenericObject {
  geometryEmitterType: number;
  layer: Layer;
  heightAbove: number;
  heightBelow: number;
  alpha: number;
  color: Float32Array;
  lifeSpan: number;
  textureSlot: number;
  emissionRate: number;
  gravity: number;
  columns: number;
  rows: number;

  constructor(model: MdxModel, emitter: RibbonEmitter, index: number) {
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

  getHeightBelow(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KRHB', instance, this.heightBelow);
  }

  getHeightAbove(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KRHA', instance, this.heightAbove);
  }

  getTextureSlot(out: Uint32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KRTX', instance, 0);
  }

  getColor(out: Float32Array, instance: MdxComplexInstance) {
    return this.getVectorValue(out, 'KRCO', instance, this.color);
  }

  getAlpha(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KRAL', instance, this.alpha);
  }

  getVisibility(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KRVS', instance, 1);
  }
}
