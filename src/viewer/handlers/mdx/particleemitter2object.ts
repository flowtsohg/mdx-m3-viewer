import MdlxParticleEmitter2 from '../../../parsers/mdlx/particleemitter2';
import Texture from '../../texture';
import MdxModel from './model';
import GenericObject from './genericobject';
import { emitterFilterMode } from './filtermode';
import replaceableIds from './replaceableids';
import { EMITTER_PARTICLE2 } from './geometryemitterfuncs';

/**
 * An MDX particle emitter type 2.
 */
export default class ParticleEmitter2Object extends GenericObject {
  geometryEmitterType: number = EMITTER_PARTICLE2;
  width: number;
  length: number;
  speed: number;
  latitude: number;
  gravity: number;
  emissionRate: number;
  squirt: number;
  lifeSpan: number;
  variation: number;
  tailLength: number;
  timeMiddle: number;
  columns: number;
  rows: number;
  teamColored: number = 0;
  internalTexture: Texture | null = null;
  replaceableId: number;
  head: boolean;
  tail: boolean;
  cellWidth: number;
  cellHeight: number;
  colors: Float32Array[] = [];
  scaling: Float32Array;
  intervals: Float32Array[];
  blendSrc: number;
  blendDst: number;
  priorityPlane: number;
  /**
   * Even if the internal texture isn't loaded, it's fine to run emitters based on this emitter object.
   * 
   * The particles will simply be black.
   */
  ok: boolean = true;

  constructor(model: MdxModel, emitter: MdlxParticleEmitter2, index: number) {
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

    this.columns = emitter.columns;
    this.rows = emitter.rows;

    if (replaceableId === 0) {
      this.internalTexture = model.textures[emitter.textureId];
    } else if (replaceableId === 1 || replaceableId === 2) {
      this.teamColored = 1;
    } else {
      let texturesExt = model.reforged ? '.dds' : '.blp';

      this.internalTexture = <Texture>model.viewer.load(`ReplaceableTextures\\${replaceableIds[replaceableId]}${texturesExt}`, model.pathSolver, model.solverParams);
    }

    this.replaceableId = emitter.replaceableId;

    let headOrTail = emitter.headOrTail;

    this.head = (headOrTail === 0 || headOrTail === 2);
    this.tail = (headOrTail === 1 || headOrTail === 2);

    this.cellWidth = 1 / emitter.columns;
    this.cellHeight = 1 / emitter.rows;

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

    let blendModes = emitterFilterMode(emitter.filterMode, this.model.viewer.gl);

    this.blendSrc = blendModes[0];
    this.blendDst = blendModes[1];

    this.priorityPlane = emitter.priorityPlane;
  }

  getWidth(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KP2N', sequence, frame, counter, this.width);
  }

  getLength(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KP2W', sequence, frame, counter, this.length);
  }

  getSpeed(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KP2S', sequence, frame, counter, this.speed);
  }

  getLatitude(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KP2L', sequence, frame, counter, this.latitude);
  }

  getGravity(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KP2G', sequence, frame, counter, this.gravity);
  }

  getEmissionRate(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KP2E', sequence, frame, counter, this.emissionRate);
  }

  getVisibility(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KP2V', sequence, frame, counter, 1);
  }

  getVariation(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KP2R', sequence, frame, counter, this.variation);
  }
}
