import RibbonEmitter from '../../../parsers/mdlx/ribbonemitter';
import MdxModel from './model';
import GenericObject from './genericobject';
import Layer from './layer';
import { EMITTER_RIBBON } from './geometryemitterfuncs';

/**
 * An MDX ribbon emitter.
 */
export default class RibbonEmitterObject extends GenericObject {
  geometryEmitterType: number = EMITTER_RIBBON;
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
  /**
   * Even if the internal texture isn't loaded, it's fine to run emitters based on this emitter object.
   * 
   * The ribbons will simply be black.
   */
  ok: boolean = true;

  constructor(model: MdxModel, emitter: RibbonEmitter, index: number) {
    super(model, emitter, index);

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

  getHeightBelow(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KRHB', sequence, frame, counter, this.heightBelow);
  }

  getHeightAbove(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KRHA', sequence, frame, counter, this.heightAbove);
  }

  getTextureSlot(out: Uint32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KRTX', sequence, frame, counter, 0);
  }

  getColor(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(out, 'KRCO', sequence, frame, counter, this.color);
  }

  getAlpha(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KRAL', sequence, frame, counter, this.alpha);
  }

  getVisibility(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KRVS', sequence, frame, counter, 1);
  }
}
