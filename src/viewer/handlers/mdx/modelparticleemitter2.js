import GenericObject from './genericobject';
import {emitterFilterMode} from './filtermode';
import replaceableIds from './replaceableids';

/**
 * An MDX particle emitter type 2.
 */
export default class ParticleEmitter2 extends GenericObject {
  /**
   * @param {MdxModel} model
   * @param {MdxParserParticleEmitter2} emitter
   * @param {number} index
   */
  constructor(model, emitter, index) {
    super(model, emitter, index);

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

    this.dimensions = [emitter.columns, emitter.rows];

    this.teamColored = false;

    if (replaceableId === 0) {
      this.internalResource = model.textures[emitter.textureId];
    } else if (replaceableId === 1) {
      this.internalResource = model.viewer.getTextureAtlas('teamColors');
      this.dimensions.fill(4);
      this.teamColored = true;
    } else if (replaceableId === 2) {
      this.internalResource = model.viewer.getTextureAtlas('teamGlows');
      this.dimensions.fill(4);
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
      this.colors[i] = new Uint8Array([Math.min(colors[i][0], 1) * 255, Math.min(colors[i][1], 1) * 255, Math.min(colors[i][2], 1) * 255, alpha[i]]);
    }

    this.scaling = emitter.segmentScaling;

    this.intervals = [...emitter.headIntervals, ...emitter.tailIntervals];

    this.lineEmitter = emitter.flags & 0x20000;
    this.modelSpace = emitter.flags & 0x80000;
    this.xYQuad = emitter.flags & 0x100000;

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
