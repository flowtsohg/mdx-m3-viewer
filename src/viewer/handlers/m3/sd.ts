import { vec3, quat } from 'gl-matrix';
import { clamp, lerp } from '../../../common/math';
import M3ParserSd from '../../../parsers/m3/sd';

const vectorHeap = vec3.create();
const quatHeap = quat.create();

/**
 * Sequence data.
 */
class M3Sd {
  keys: Int32Array;
  values: TypedArray[] | number[];
  biggestKey: number;

  constructor(sd: M3ParserSd) {
    this.keys = <Int32Array>sd.keys.getAll();
    this.values = <TypedArray[]>sd.values.getAll();
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
    let fakeVa = <TypedArray>va; /// UGLY!!!

    if (fakeVa.length === 4) {
      if (interpolationType === 0) {
        return quat.copy(quatHeap, <quat>va);
      } else {
        return quat.slerp(quatHeap, <quat>va, <quat>vb, t);
      }
    } else if (fakeVa.length === 3) {
      if (interpolationType === 0) {
        return vec3.copy(vectorHeap, <vec3>va);
      } else {
        return vec3.lerp(vectorHeap, <vec3>va, <vec3>vb, t);
      }
    } else {
      if (interpolationType === 0) {
        return va;
      } else {
        return lerp(<number>va, <number>vb, t);
      }
    }
  }
}
