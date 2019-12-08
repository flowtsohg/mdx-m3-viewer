import { vec3, quat } from 'gl-matrix';
import { clamp, lerp, hermite, bezier } from '../../../common/math';
import { Animation, UintAnimation, FloatAnimation, Vector3Animation, Vector4Animation } from '../../../parsers/mdlx/animations';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';

/**
 * Animated data for a specific sequence.
 */
class SdSequence {
  sd: Sd;
  start: number;
  end: number;
  frames: number[];
  values: (Uint32Array | Float32Array)[];
  inTans: (Uint32Array | Float32Array)[];
  outTans: (Uint32Array | Float32Array)[];
  constant: boolean;

  constructor(sd: Sd, start: number, end: number, animation: Animation, isGlobal: boolean) {
    this.sd = sd;
    this.start = start;
    this.end = end;
    this.frames = [];
    this.values = [];
    this.inTans = [];
    this.outTans = [];
    this.constant = false;

    let interpolationType = sd.interpolationType;
    let frames = animation.frames;
    let values = animation.values;
    let inTans = animation.inTans;
    let outTans = animation.outTans;
    let defval = sd.defval;

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
      let frame = frames[i];

      if (frame >= start && frame <= end) {
        this.frames.push(frame);
        this.values.push(values[i]);

        if (interpolationType > 1) {
          this.inTans.push(inTans[i]);
          this.outTans.push(outTans[i]);
        }
      }
    }

    let tracksCount = this.frames.length;

    if (tracksCount === 0) {
      // If there are no keys, use the default value directly.
      this.constant = true;

      this.frames[0] = start;
      this.values[0] = defval;
    } else if (tracksCount === 1) {
      // If there's only one key, use it directly.
      this.constant = true;
    } else {
      let firstValue = this.values[0];

      // If all of the values in this sequence are the same, might as well make it constant.
      this.constant = this.values.every((value) => firstValue.every((element, index) => element === value[index]));

      if (!this.constant) {
        // If there is no opening keyframe for this sequence, inject one with the default value.
        if (this.frames[0] !== start) {
          this.frames.unshift(start);
          this.values.unshift(defval);

          if (interpolationType > 1) {
            this.inTans.unshift(defval);
            this.outTans.unshift(defval);
          }
        }

        // If there is no closing keyframe for this sequence, inject one with the default value.
        if (this.frames[this.frames.length - 1] !== end) {
          this.frames.push(end);
          this.values.push(this.values[0]);

          if (interpolationType > 1) {
            this.inTans.push(this.inTans[0]);
            this.outTans.push(this.outTans[0]);
          }
        }
      }
    }
  }

  getValue(out: Uint32Array | Float32Array, frame: number) {
    let frames = this.frames;
    let l = frames.length;

    if (this.constant || frame < this.start) {
      this.sd.copy(out, this.values[0]);

      return -1;
    } else if (frame >= this.end) {
      this.sd.copy(out, this.values[l - 1]);

      return l - 1;
    } else {
      for (let i = 1; i < l; i++) {
        if (frames[i] > frame) {
          let start = frames[i - 1];
          let end = frames[i];
          let t = clamp((frame - start) / (end - start), 0, 1);

          this.sd.interpolate(out, this.values, this.inTans, this.outTans, i - 1, i, t);

          return i;
        }
      }

      return -1;
    }
  }
}

const forcedInterpMap = {
  KLAV: 0,
  KATV: 0,
  KPEV: 0,
  KP2V: 0,
  KRVS: 0,
};

const defVals = {
  // LAYS
  KMTF: [0],
  KMTA: [1],
  // TXAN
  KTAT: [0, 0, 0],
  KTAR: [0, 0, 0, 1],
  KTAS: [1, 1, 1],
  // GEOA
  KGAO: [1],
  KGAC: [0, 0, 0],
  // LITE
  KLAS: [0],
  KLAE: [0],
  KLAC: [0, 0, 0],
  KLAI: [0],
  KLBI: [0],
  KLBC: [0, 0, 0],
  KLAV: [1],
  // ATCH
  KATV: [1],
  // PREM
  KPEE: [0],
  KPEG: [0],
  KPLN: [0],
  KPLT: [0],
  KPEL: [0],
  KPES: [0],
  KPEV: [1],
  // PRE2
  KP2S: [0],
  KP2R: [0],
  KP2L: [0],
  KP2G: [0],
  KP2E: [0],
  KP2N: [0],
  KP2W: [0],
  KP2V: [1],
  // RIBB
  KRHA: [0],
  KRHB: [0],
  KRAL: [1],
  KRCO: [0, 0, 0],
  KRTX: [0],
  KRVS: [1],
  // CAMS
  KCTR: [0, 0, 0],
  KTTR: [0, 0, 0],
  KCRL: [0],
  // NODE
  KGTR: [0, 0, 0],
  KGRT: [0, 0, 0, 1],
  KGSC: [1, 1, 1],
};

/**
 * Animated data.
 */
export abstract class Sd {
  defval: CHANGE_ME;
  model: MdxModel;
  name: string;
  globalSequence: SdSequence | null;
  sequences: SdSequence[];
  interpolationType: number;

  abstract copy(out: Uint32Array | Float32Array, value: Uint32Array | Float32Array): void;
  abstract interpolate(out: Uint32Array | Float32Array, values: (Uint32Array | Float32Array)[], inTans: (Uint32Array | Float32Array)[], outTans: (Uint32Array | Float32Array)[], start: number, end: number, t: number): void;

  constructor(model: MdxModel, animation: Animation) {
    let globalSequences = model.globalSequences;
    let globalSequenceId = animation.globalSequenceId;
    let forcedInterp = forcedInterpMap[animation.name];

    this.model = model;
    this.name = animation.name;
    this.defval = defVals[animation.name];
    this.globalSequence = null;
    this.sequences = [];

    // Allow to force an interpolation type.
    // The game seems to do this with visibility tracks, where the type is forced to None.
    // It came up as a bug report by a user who used the wrong interpolation type.
    this.interpolationType = forcedInterp !== undefined ? forcedInterp : animation.interpolationType;

    if (globalSequenceId !== -1 && globalSequences) {
      this.globalSequence = new SdSequence(this, 0, globalSequences[globalSequenceId], animation, true);
    } else {
      for (let sequence of model.sequences) {
        let interval = sequence.interval;

        this.sequences.push(new SdSequence(this, interval[0], interval[1], animation, false));
      }
    }
  }

  getValue(out: Uint32Array | Float32Array, instance: MdxComplexInstance) {
    if (this.globalSequence) {
      return this.globalSequence.getValue(out, instance.counter % this.globalSequence.end);
    } else if (instance.sequence !== -1) {
      return this.sequences[instance.sequence].getValue(out, instance.frame);
    } else {
      this.copy(out, this.defval);

      return -1;
    }
  }

  isVariant(sequence: number) {
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
  copy(out: Uint32Array | Float32Array, value: Uint32Array | Float32Array) {
    out[0] = value[0];
  }

  interpolate(out: Uint32Array | Float32Array, values: (Uint32Array | Float32Array)[], inTans: (Uint32Array | Float32Array)[], outTans: (Uint32Array | Float32Array)[], start: number, end: number, t: number) {
    let interpolationType = this.interpolationType;
    let startValue = values[start][0];

    if (interpolationType === 0) {
      out[0] = startValue;
    } else if (interpolationType === 1) {
      out[0] = lerp(startValue, values[end][0], t);
    } else if (interpolationType === 2) {
      out[0] = hermite(startValue, outTans[start][0], inTans[end][0], values[end][0], t);
    } else if (interpolationType === 3) {
      out[0] = bezier(startValue, outTans[start][0], inTans[end][0], values[end][0], t);
    }
  }
}

/**
 * A vector animation.
 */
export class VectorSd extends Sd {
  copy(out: vec3, value: vec3) {
    vec3.copy(out, value);
  }

  interpolate(out: vec3, values: vec3[], inTans: vec3[], outTans: vec3[], start: number, end: number, t: number) {
    let interpolationType = this.interpolationType;

    if (interpolationType === 0) {
      vec3.copy(out, values[start]);
    } else if (interpolationType === 1) {
      vec3.lerp(out, values[start], values[end], t);
    } else if (interpolationType === 2) {
      vec3.hermite(out, values[start], outTans[start], inTans[end], values[end], t);
    } else if (interpolationType === 3) {
      vec3.bezier(out, values[start], outTans[start], inTans[end], values[end], t);
    }
  }
}

/**
 * A quaternion animation.
 */
export class QuatSd extends Sd {
  copy(out: quat, value: quat) {
    quat.copy(out, value);
  }

  interpolate(out: quat, values: quat[], inTans: quat[], outTans: quat[], start: number, end: number, t: number) {
    let interpolationType = this.interpolationType;

    if (interpolationType === 0) {
      quat.copy(out, values[start]);
    } else if (interpolationType === 1) {
      quat.slerp(out, values[start], values[end], t);
    } else if (interpolationType === 2 || interpolationType === 3) {
      quat.sqlerp(out, values[start], outTans[start], inTans[end], values[end], t);
    }
  }
}

export function createTypedSd(model: MdxModel, animation: Animation) {
  if (animation instanceof UintAnimation || animation instanceof FloatAnimation) {
    return new ScalarSd(model, animation);
  } else if (animation instanceof Vector3Animation) {
    return new VectorSd(model, animation);
  } else {
    return new QuatSd(model, animation);
  }
}
