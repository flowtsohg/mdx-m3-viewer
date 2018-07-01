import {clamp} from '../../../common/math';
import {interpolateScalar, interpolateVector, interpolateQuaternion} from '../../../common/interpolator';

let aHeap = new Float32Array(1);
let bHeap = new Float32Array(1);
let scalarHeap = new Float32Array(1);
let vectorHeap = new Float32Array(3);
let quatHeap = new Float32Array(4);

/**
 * Sequence data.
 */
class M3Sd {
  /**
   * @param {M3ParserSd} sd
   */
  constructor(sd) {
    this.keys = sd.keys.getAll();
    this.values = sd.values.getAll();
    this.biggestKey = sd.biggestKey;
  }
}

/**
 * A sequence data container.
 */
export default class M3SdContainer {
  /**
   * @param {Array<M3ParserSd>} sd
   */
  constructor(sd) {
    this.sd = sd.map((sd) => new M3Sd(sd));
  }

  getValueUnsafe(index, animationReference, frame, runsConcurrent) {
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

    if (va.length === 4) {
      interpolateQuaternion(quatHeap, va, 0, 0, vb, t, animationReference.interpolationType);
      return quatHeap;
    } else if (va.length === 3) {
      interpolateVector(vectorHeap, va, 0, 0, vb, t, animationReference.interpolationType);
      return vectorHeap;
    } else {
      aHeap[0] = va;
      bHeap[0] = vb;
      interpolateScalar(scalarHeap, aHeap, 0, 0, bHeap, t, animationReference.interpolationType);
      return scalarHeap[0];
    }
  }
}
