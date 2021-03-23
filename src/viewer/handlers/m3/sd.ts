import { vec3, quat } from 'gl-matrix';
import { clamp, lerp } from '../../../common/math';
import { AnimationReference } from '../../../parsers/m3/animationreference';
import M3ParserSd from '../../../parsers/m3/sd';

const vectorHeap = vec3.create();
const quatHeap = quat.create();

/**
 * Sequence data.
 */
class M3Sd {
  keys: Int32Array;
  values: vec3[] | quat[] | number[];
  biggestKey: number;

  constructor(sd: M3ParserSd) {
    this.keys = <Int32Array>sd.keys.get();
    this.values = <vec3[]>sd.values.get(); // Fake typecasting to avoid a TS error.
    this.biggestKey = sd.biggestKey;
  }
}

/**
 * A sequence data container.
 */
export default class M3SdContainer {
  sd: M3Sd[] = [];

  addSds(sds: M3ParserSd[]) {
    for (let sd of sds) {
      this.sd.push(new M3Sd(sd));
    }
  }

  getValueUnsafe(index: number, animationReference: AnimationReference, frame: number, runsConcurrent: number) {
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
    let fakeVa = <vec3>va; /// UGLY!!!

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
