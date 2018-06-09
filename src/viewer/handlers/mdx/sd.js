import {clamp} from '../../../common/math';
import Interpolator from '../../../common/interpolator';
import {UintAnimation, FloatAnimation, Vector3Animation, Vector4Animation} from '../../../parsers/mdlx/animations';

/**
 * Animated data for a specific sequence.
 */
class SdSequence {
  /**
   * @param {Sd} sd
   * @param {number} start
   * @param {number} end
   * @param {Array<Track>} keyframes
   * @param {boolean} isGlobalSequence
   */
  constructor(sd, start, end, keyframes, isGlobalSequence) {
    let defval = sd.defval;

    this.sd = sd;
    this.start = start;
    this.end = end;
    this.keyframes = [];

    // When using a global sequence, where the first key is outside of the sequence's length, it becomes its constant value.
    // When having one key in the sequence's range, and one key outside of it, results seem to be non-deterministic.
    // Sometimes the second key is used too, sometimes not.
    // It also differs depending where the model is viewed - the WE previewer, the WE itself, or the game.
    // All three show different results, none of them make sense.
    // Therefore, only handle the case where the first key is outside.
    // This fixes problems spread over many models, e.g. HeroMountainKing (compare in WE and in Magos).
    if (isGlobalSequence && keyframes[0].frame > end) {
      this.keyframes.push(keyframes[0]);
    }

    // Go over the keyframes, and add all of the ones that are in this sequence (start <= frame <= end).
    for (let i = 0, l = keyframes.length; i < l; i++) {
      let keyframe = keyframes[i];
      let frame = keyframe.frame;

      if (frame >= start && frame <= end) {
        this.keyframes.push(keyframe);
      }
    }

    let keyframeCount = this.keyframes.length;

    if (keyframeCount === 0) {
      // If there are no keys, use the default value directly.
      this.constant = true;
      this.keyframes.push({frame: start, value: defval, inTan: defval, outTan: defval});
    } else if (keyframeCount === 1) {
      // If there's only one key, use it directly.
      this.constant = true;
    } else {
      // If all of the values in this sequence are the same, might as well make it constant.
      let constant = true;
      let firstValue = this.keyframes[0].value;

      for (let i = 1, l = this.keyframes.length; i < l; i++) {
        let keyframe = this.keyframes[i];
        let value = keyframe.value;

        if (value.length > 0) {
          for (let j = 0, k = value.length; j < k; j++) {
            if (firstValue[j] !== value[j]) {
              constant = false;
              break;
            }
          }
        } else {
          if (value !== firstValue) {
            constant = false;
            break;
          }
        }
      }

      if (constant) {
        this.constant = true;
      } else {
        this.constant = false;

        // If there is no opening keyframe for this sequence, inject one with the default value.
        if (this.keyframes[0].frame !== start) {
          this.keyframes.unshift({frame: start, value: defval, inTan: defval, outTan: defval});
        }

        // If there is no closing keyframe for this sequence, inject one with the default value.
        if (this.keyframes[this.keyframes.length - 1].frame !== end) {
          this.keyframes.push({frame: end, value: this.keyframes[0].value, inTan: this.keyframes[0].outTan, outTan: this.keyframes[0].inTan});
        }
      }
    }
  }

  /**
   * @param {Uint32Array|Float32Array|vec3|quat} out
   * @param {number} frame
   * @return {number}
   */
  getValue(out, frame) {
    let index = this.getKeyframe(frame);
    let keyframes = this.keyframes;

    if (index === 0) {
      out.set(keyframes[0].value);
    } else {
      let start = keyframes[index - 1];
      let end = keyframes[index];
      let t = clamp((frame - start.frame) / (end.frame - start.frame), 0, 1);

      this.sd.interpolate(out, start.value, start.outTan, end.inTan, end.value, t);
    }

    return index;
  }

  /**
   * @param {number} frame
   * @return {number}
   */
  getKeyframe(frame) {
    if (this.constant) {
      return 0;
    } else {
      let keyframes = this.keyframes;
      let l = keyframes.length;

      if (frame <= this.start) {
        return 0;
      } else if (frame >= this.end) {
        return l - 1;
      } else {
        for (let i = 1; i < l; i++) {
          let keyframe = keyframes[i];

          if (keyframe.frame > frame) {
            return i;
          }
        }
      }
    }
  }
}

let forcedInterpMap = {
  KLAV: 0,
  KATV: 0,
  KPEV: 0,
  KP2V: 0,
  KRVS: 0,
};

let defVals = {
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
 * Sequence data.
 */
class Sd {
  /**
   * @param {MdxModel} model
   * @param {UintAnimation|FloatAnimation|Vector3Animation|Vector4Animation} animation
   */
  constructor(model, animation) {
    let globalSequences = model.globalSequences;
    let globalSequenceId = animation.globalSequenceId;
    let tracks = animation.tracks;
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
      this.globalSequence = new SdSequence(this, 0, globalSequences[globalSequenceId], tracks, true);
    } else {
      for (let sequence of model.sequences) {
        this.sequences.push(new SdSequence(this, ...sequence.interval, tracks, false));
      }
    }
  }

  /**
   * @param {Uint32Array|Float32Array|vec3|quat} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getValue(out, instance) {
    if (this.globalSequence) {
      return this.globalSequence.getValue(out, instance.counter % this.globalSequence.end);
    } else if (instance.sequence !== -1) {
      return this.sequences[instance.sequence].getValue(out, instance.frame);
    } else {
      this.defaultValue(out);
      return -1;
    }
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isVariant(sequence) {
    if (this.globalSequence) {
      return !this.globalSequence.constant;
    } else {
      return !this.sequences[sequence].constant;
    }
  }

  /**
   * @return {Array<number|vec3|quat>}
   */
  getValues() {
    if (this.globalSequence) {
      return this.globalSequence.keyframes.map((track) => track.value);
    } else {
      let values = [];

      for (let sequence of this.sequences) {
        values.push(...sequence.keyframes.map((track) => track.value));
      }

      return values;
    }
  }
}

/**
 * uint sequence data.
 */
class UintSd extends Sd {
  /**
   * @param {Uint32Array} out
   */
  defaultValue(out) {
    out[0] = this.defval[0];
  }

  /**
   * @param {Uint32Array} out
   * @param {Uint32Array} start
   * @param {Uint32Array} outTan
   * @param {Uint32Array} inTan
   * @param {Uint32Array} end
   * @param {number} t
   */
  interpolate(out, start, outTan, inTan, end, t) {
    out[0] = Interpolator.scalar(start[0], outTan[0], inTan[0], end[0], t, this.interpolationType) | 0;
  }
}

/**
 * float sequence data.
 */
class FloatSd extends Sd {
  /**
   * @param {Float32Array} out
   */
  defaultValue(out) {
    out[0] = this.defval[0];
  }

  /**
   * @param {Float32Array} out
   * @param {Float32Array} start
   * @param {Float32Array} outTan
   * @param {Float32Array} inTan
   * @param {Float32Array} end
   * @param {number} t
   */
  interpolate(out, start, outTan, inTan, end, t) {
    out[0] = Interpolator.scalar(start[0], outTan[0], inTan[0], end[0], t, this.interpolationType);
  }
}

/**
 * vec3 sequence data.
 */
class Vector3Sd extends Sd {
  /**
   * @param {vec3} out
   */
  defaultValue(out) {
    vec3.copy(out, this.defval);
  }

  /**
   * @param {vec3} out
   * @param {vec3} start
   * @param {vec3} outTan
   * @param {vec3} inTan
   * @param {vec3} end
   * @param {number} t
   */
  interpolate(out, start, outTan, inTan, end, t) {
    vec3.copy(out, Interpolator.vector(start, outTan, inTan, end, t, this.interpolationType));
  }
}

/**
 * quat sequence data.
 */
class Vector4Sd extends Sd {
  /**
   * @param {quat} out
   */
  defaultValue(out) {
    quat.copy(out, this.defval);
  }

  /**
   * @param {quat} out
   * @param {quat} start
   * @param {quat} outTan
   * @param {quat} inTan
   * @param {quat} end
   * @param {number} t
   */
  interpolate(out, start, outTan, inTan, end, t) {
    quat.copy(out, Interpolator.quaternion(start, outTan, inTan, end, t, this.interpolationType));
  }
}

/**
 * @param {Model} model
 * @param {UintAnimation|FloatAnimation|Vector3Animation|Vector4Animation} animation
 * @return {UintSd|FloatSd|Vector3Sd|Vector4Sd}
 */
export default function createTypedSd(model, animation) {
  let ClassObject;

  if (animation instanceof UintAnimation) {
    ClassObject = UintSd;
  } else if (animation instanceof FloatAnimation) {
    ClassObject = FloatSd;
  } else if (animation instanceof Vector3Animation) {
    ClassObject = Vector3Sd;
  } else if (animation instanceof Vector4Animation) {
    ClassObject = Vector4Sd;
  }

  return new ClassObject(model, animation);
}
