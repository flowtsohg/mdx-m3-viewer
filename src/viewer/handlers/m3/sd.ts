import { clamp, lerp } from '../../../common/math';
import M3ParserSd from '../../../parsers/m3/sd';

const vectorHeap = new Float32Array(3);
const quatHeap = new Float32Array(4);

/**
 * Sequence data.
 */
class M3Sd {
  keys: any[];
  values: any[];
  biggestKey: number;

  constructor(sd: M3ParserSd) {
    this.keys = sd.keys.getAll();
    this.values = sd.values.getAll();
    this.biggestKey = sd.biggestKey;
  }
}

/**
 * A sequence data container.
 */
export default class M3SdContainer {
  sd: M3Sd[];

  constructor(sd: M3ParserSd[]) {
    this.sd = sd.map((sd) => new M3Sd(sd));
  }

  getValueUnsafe(index: number, animationReference: any, frame: number, runsConcurrent: number) {
    let sd = this.sd[index];

    if (runsConcurrent) {
      frame = frame % sd.biggestKey;
    }

    let keys = sd.keys;
    let values = sd.values;

    // getInterval
    let a = keys.length;
    let b = 0;

    while (b !== keys.length && frame > keys[b]) {
      a = b;
      b++;
    }

    let length = keys.length;

    if (a === length) {
      if (b === length) {
        return animationReference.initValue;
      } else {
        return values[b];
      }
    }

    if (b === length || a >= b) {
      return values[a];
    }

    let t = clamp((frame - keys[a]) / (keys[b] - keys[a]), 0, 1);
    let va = values[a];
    let vb = values[b];
    let interpolationType = animationReference.interpolationType;

    if (va.length === 4) {
      if (interpolationType === 0) {
        return quat.copy(quatHeap, va);
      } else {
        return quat.slerp(quatHeap, va, vb, t);
      }
    } else if (va.length === 3) {
      if (interpolationType === 0) {
        return vec3.copy(vectorHeap, va);
      } else {
        return vec3.lerp(vectorHeap, va, vb, t);
      }
    } else {
      if (interpolationType === 0) {
        return va;
      } else {
        return lerp(va, vb, t);
      }
    }
  }
}
