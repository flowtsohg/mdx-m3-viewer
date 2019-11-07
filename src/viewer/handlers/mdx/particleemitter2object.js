import GenericObject from './genericobject';
import {emitterFilterMode} from './filtermode';
import replaceableIds from './replaceableids';
import {EMITTER_PARTICLE2} from './geometryemitterfuncs';

/**
 * An MDX particle emitter type 2.
 */
export default class ParticleEmitter2Object extends GenericObject {
  /**
   * @param {MdxModel} model
   * @param {MdxParserParticleEmitter2} emitter
   * @param {number} index
   */
  constructor(model, emitter, index) {
    super(model, emitter, index);

    this.geometryEmitterType = EMITTER_PARTICLE2;

    this.width = emitter.width;
    this.length = emitter.length;
    this.speed = emitter.speed;
    this.latitude = emitter.latitude;
    this.gravity = emitter.gravity;
    this.emissionRate = emitter.emissionRate;
    this.squirt = emitter.squirt;
    this.lifeSpan = emitter.lifeSpan;
    this.variation = emitter.variation;
    this.tailLength = emitter.tailLength;
    this.timeMiddle = emitter.timeMiddle;

    let replaceableId = emitter.replaceableId;

    this.columns = emitter.columns;
    this.rows = emitter.rows;

    this.teamColored = false;

    if (replaceableId === 0) {
      this.internalResource = model.textures[emitter.textureId];
    } else if (replaceableId === 1 || replaceableId === 2) {
      this.teamColored = true;
    } else {
      this.internalResource = model.viewer.load('ReplaceableTextures\\' + replaceableIds[replaceableId] + '.blp', model.pathSolver);
    }

    this.replaceableId = emitter.replaceableId;

    let headOrTail = emitter.headOrTail;

    this.head = (headOrTail === 0 || headOrTail === 2);
    this.tail = (headOrTail === 1 || headOrTail === 2);

    this.cellWidth = 1 / emitter.columns;
    this.cellHeight = 1 / emitter.rows;
    this.colors = [];

    let colors = emitter.segmentColors;
    let alpha = emitter.segmentAlphas;

    for (let i = 0; i < 3; i++) {
      let color = colors[i];

      this.colors[i] = new Float32Array([color[0], color[1], color[2], alpha[i] / 255]);
    }

    this.scaling = emitter.segmentScaling;

    let headIntervals = emitter.headIntervals;
    let tailIntervals = emitter.tailIntervals;

    // Change to Float32Array instead of Uint32Array to be able to pass the intervals directly using uniform3fv().
    this.intervals = [
      new Float32Array(headIntervals[0]),
      new Float32Array(headIntervals[1]),
      new Float32Array(tailIntervals[0]),
      new Float32Array(tailIntervals[1]),
    ];

    [this.blendSrc, this.blendDst] = emitterFilterMode(emitter.filterMode, this.model.viewer.gl);

    this.priorityPlane = emitter.priorityPlane;
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getWidth(out, instance) {
    return this.getFloatValue(out, 'KP2W', instance, this.width);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getLength(out, instance) {
    return this.getFloatValue(out, 'KP2N', instance, this.length);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getSpeed(out, instance) {
    return this.getFloatValue(out, 'KP2S', instance, this.speed);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getLatitude(out, instance) {
    return this.getFloatValue(out, 'KP2L', instance, this.latitude);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getGravity(out, instance) {
    return this.getFloatValue(out, 'KP2G', instance, this.gravity);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getEmissionRate(out, instance) {
    return this.getFloatValue(out, 'KP2E', instance, this.emissionRate);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVisibility(out, instance) {
    return this.getFloatValue(out, 'KP2V', instance, 1);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVariation(out, instance) {
    return this.getFloatValue(out, 'KP2R', instance, this.variation);
  }
}
