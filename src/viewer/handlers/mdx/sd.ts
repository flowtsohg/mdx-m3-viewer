import { vec3, quat } from 'gl-matrix';
import { lerp, hermite, bezier } from '../../../common/math';
import { Animation, UintAnimation, FloatAnimation, Vector3Animation, InterpolationType } from '../../../parsers/mdlx/animations';
import MdxModel from './model';

/**
 * Animated data for a specific sequence.
 */
class SdSequence {
  sd: Sd;
  start: number;
  end: number;
  frames: number[] = [];
  values: (Uint32Array | Float32Array)[] = [];
  inTans: (Uint32Array | Float32Array)[] = [];
  outTans: (Uint32Array | Float32Array)[] = [];
  constant = false;

  constructor(sd: Sd, start: number, end: number, animation: Animation, isGlobal: boolean) {
    this.sd = sd;
    this.start = start;
    this.end = end;

    const interpolationType = sd.interpolationType;
    const frames = animation.frames;
    const values = animation.values;
    const inTans = animation.inTans;
    const outTans = animation.outTans;
    const defval = sd.defval;

    // When using a global sequence, where the first key is outside of the sequence's length, it becomes its constant value.
    // When having one key in the sequence's range, and one key outside of it, results seem to be non-deterministic.
    // Sometimes the second key is used too, sometimes not.
    // It also differs depending where the model is viewed - the WE previewer, the WE itself, or the game.
    // All three show different results, none of them make sense.
    // Therefore, only handle the case where the first key is outside.
    // This fixes problems spread over many models, e.g. HeroMountainKing (compare in WE and in Magos).
    if (isGlobal && frames[0] > end) {
      this.frames[0] = frames[0];
      this.values[0] = values[0];
    }

    // Go over the keyframes, and add all of the ones that are in this sequence (start <= frame <= end).
    for (let i = 0, l = frames.length; i < l; i++) {
      const frame = frames[i];

      if (frame >= start && frame <= end) {
        this.frames.push(frame);
        this.values.push(values[i]);

        if (interpolationType > 1) {
          this.inTans.push(inTans[i]);
          this.outTans.push(outTans[i]);
        }
      }
    }

    const tracksCount = this.frames.length;

    if (tracksCount === 0) {
      // If there are no keys, use the default value directly.
      this.constant = true;

      this.frames[0] = start;
      this.values[0] = defval;
    } else if (tracksCount === 1) {
      // If there's only one key, use it directly.
      this.constant = true;
    } else {
      const firstValue = this.values[0];

      // If all of the values in this sequence are the same, might as well make it constant.
      this.constant = this.values.every((value) => firstValue.every((element: number, index: number) => element === value[index]));
    }
  }

  getValue(out: Uint32Array | Float32Array, frame: number): number {
    const frames = this.frames;
    const length = frames.length;

    // Fixed implementation copied directly from Retera's code. Thank you!
    if (this.constant || frame < this.start) {
      this.sd.copy(out, this.values[0]);

      return -1;
    } else {
      let startFrameIndex = -1;
      let endFrameIndex = -1;
      const lengthLessOne = length - 1;

      if ((frame < this.frames[0]) || (frame >= this.frames[lengthLessOne])) {
        startFrameIndex = lengthLessOne;
        endFrameIndex = 0;
      } else {
        for (let i = 1; i < length; i++) {
          if (this.frames[i] > frame) {
            startFrameIndex = i - 1;
            endFrameIndex = i;
            break;
          }
        }
      }

      let startFrame = this.frames[startFrameIndex];
      const endFrame = this.frames[endFrameIndex];
      let timeBetweenFrames = endFrame - startFrame;

      if (timeBetweenFrames < 0) {
        timeBetweenFrames += (this.end - this.start);

        if (frame < startFrame) {
          startFrame = endFrame;
        }
      }

      const t = ((timeBetweenFrames) == 0 ? 0 : ((frame - startFrame) / timeBetweenFrames));
      this.sd.interpolate(out, this.values, this.inTans, this.outTans, startFrameIndex, endFrameIndex, t);

      return startFrameIndex;
    }
  }
}

const forcedInterpMap = {
  KLAV: InterpolationType.DontInterp,
  KATV: InterpolationType.DontInterp,
  KPEV: InterpolationType.DontInterp,
  KP2V: InterpolationType.DontInterp,
  KRVS: InterpolationType.DontInterp,
};

const floatDefval = new Float32Array(1);
const uintDefval = new Uint32Array(1);
const visibilityDefval = new Float32Array([1]);
const translationDefval = vec3.create();
const rotationDefval = quat.create();
const scaleDefval = vec3.fromValues(1, 1, 1);
const alphaDefval = visibilityDefval;
const colorDefval = translationDefval;

const defVals = {
  // LAYS
  KMTF: floatDefval,
  KMTA: alphaDefval,
  // TXAN
  KTAT: translationDefval,
  KTAR: rotationDefval,
  KTAS: scaleDefval,
  // GEOA
  KGAO: alphaDefval,
  KGAC: colorDefval,
  // LITE
  KLAS: floatDefval,
  KLAE: floatDefval,
  KLAC: colorDefval,
  KLAI: floatDefval,
  KLBI: floatDefval,
  KLBC: colorDefval,
  KLAV: visibilityDefval,
  // ATCH
  KATV: visibilityDefval,
  // PREM
  KPEE: floatDefval,
  KPEG: floatDefval,
  KPLN: floatDefval,
  KPLT: floatDefval,
  KPEL: floatDefval,
  KPES: floatDefval,
  KPEV: visibilityDefval,
  // PRE2
  KP2S: floatDefval,
  KP2R: floatDefval,
  KP2L: floatDefval,
  KP2G: floatDefval,
  KP2E: floatDefval,
  KP2N: floatDefval,
  KP2W: floatDefval,
  KP2V: visibilityDefval,
  // RIBB
  KRHA: floatDefval,
  KRHB: floatDefval,
  KRAL: new Float32Array([0]), // Ribbon emitter alphas default to 0 rather than 1.
  KRCO: colorDefval,
  KRTX: floatDefval,
  KRVS: visibilityDefval,
  // CAMS
  KCTR: translationDefval,
  KTTR: translationDefval,
  KCRL: uintDefval,
  // NODE
  KGTR: translationDefval,
  KGRT: rotationDefval,
  KGSC: scaleDefval,
};

/**
 * Animated data.
 */
export abstract class Sd {
  defval: Float32Array | Uint32Array;
  model: MdxModel;
  name: string;
  globalSequence: SdSequence | null = null;
  sequences: SdSequence[] = [];
  interpolationType: InterpolationType;

  abstract copy(out: Uint32Array | Float32Array | vec3 | quat, value: Uint32Array | Float32Array | vec3 | quat): void;
  abstract interpolate(out: Uint32Array | Float32Array | vec3 | quat, values: (Uint32Array | Float32Array | vec3 | quat)[], inTans: (Uint32Array | Float32Array | vec3 | quat)[], outTans: (Uint32Array | Float32Array | vec3 | quat)[], start: number, end: number, t: number): void;

  constructor(model: MdxModel, animation: Animation) {
    const globalSequences = model.globalSequences;
    const globalSequenceId = animation.globalSequenceId;
    const forcedInterp = forcedInterpMap[animation.name];

    this.model = model;
    this.name = animation.name;
    this.defval = defVals[animation.name];

    // Allow to force an interpolation type.
    // The game seems to do this with visibility tracks, where the type is forced to None.
    // It came up as a bug report by a user who used the wrong interpolation type.
    this.interpolationType = forcedInterp !== undefined ? forcedInterp : animation.interpolationType;

    if (globalSequenceId !== -1 && globalSequences) {
      this.globalSequence = new SdSequence(this, 0, globalSequences[globalSequenceId], animation, true);
    } else {
      for (const sequence of model.sequences) {
        const interval = sequence.interval;

        this.sequences.push(new SdSequence(this, interval[0], interval[1], animation, false));
      }
    }
  }

  getValue(out: Uint32Array | Float32Array, sequence: number, frame: number, counter: number): number {
    if (this.globalSequence) {
      return this.globalSequence.getValue(out, counter % this.globalSequence.end);
    }

    return this.sequences[sequence].getValue(out, frame);
  }

  isVariant(sequence: number): boolean {
    if (this.globalSequence) {
      return !this.globalSequence.constant;
    } else {
      return !this.sequences[sequence].constant;
    }
  }
}

/**
 * A scalar animation.
 */
export class ScalarSd extends Sd {
  copy<T extends Uint32Array | Float32Array>(out: T, value: T): void {
    out[0] = value[0];
  }

  interpolate<T extends Uint32Array | Float32Array>(out: T, values: T[], inTans: T[], outTans: T[], start: number, end: number, t: number): void {
    const interpolationType = this.interpolationType;
    const startValue = values[start][0];

    if (interpolationType === InterpolationType.DontInterp) {
      out[0] = startValue;
    } else if (interpolationType === InterpolationType.Linear) {
      out[0] = lerp(startValue, values[end][0], t);
    } else if (interpolationType === InterpolationType.Hermite) {
      out[0] = hermite(startValue, outTans[start][0], inTans[end][0], values[end][0], t);
    } else if (interpolationType === InterpolationType.Bezier) {
      out[0] = bezier(startValue, outTans[start][0], inTans[end][0], values[end][0], t);
    }
  }
}

/**
 * A vector animation.
 */
export class VectorSd extends Sd {
  copy(out: vec3, value: vec3): void {
    vec3.copy(out, value);
  }

  interpolate(out: vec3, values: vec3[], inTans: vec3[], outTans: vec3[], start: number, end: number, t: number): void {
    const interpolationType = this.interpolationType;

    if (interpolationType === InterpolationType.DontInterp) {
      vec3.copy(out, values[start]);
    } else if (interpolationType === InterpolationType.Linear) {
      vec3.lerp(out, values[start], values[end], t);
    } else if (interpolationType === InterpolationType.Hermite) {
      vec3.hermite(out, values[start], outTans[start], inTans[end], values[end], t);
    } else if (interpolationType === InterpolationType.Bezier) {
      vec3.bezier(out, values[start], outTans[start], inTans[end], values[end], t);
    }
  }
}

/**
 * A quaternion animation.
 */
export class QuatSd extends Sd {
  copy(out: quat, value: quat): void {
    quat.copy(out, value);
  }

  interpolate(out: quat, values: quat[], inTans: quat[], outTans: quat[], start: number, end: number, t: number): void {
    const interpolationType = this.interpolationType;

    if (interpolationType === InterpolationType.DontInterp) {
      quat.copy(out, values[start]);
    } else if (interpolationType === InterpolationType.Linear) {
      quat.slerp(out, values[start], values[end], t);
    } else if (interpolationType === InterpolationType.Hermite || interpolationType === InterpolationType.Bezier) {
      quat.sqlerp(out, values[start], outTans[start], inTans[end], values[end], t);
    }
  }
}

export function createTypedSd(model: MdxModel, animation: Animation): ScalarSd | VectorSd | QuatSd {
  if (animation instanceof UintAnimation || animation instanceof FloatAnimation) {
    return new ScalarSd(model, animation);
  } else if (animation instanceof Vector3Animation) {
    return new VectorSd(model, animation);
  } else {
    return new QuatSd(model, animation);
  }
}
