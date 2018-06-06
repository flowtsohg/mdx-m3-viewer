import {vec3} from 'gl-matrix';
import {clamp} from '../../../common/math';
import Interpolator from '../../../common/interpolator';

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
    // /getInterval

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

    // M3 doesn't seem to have hermite/bezier interpolations, so just feed 0 to the in/out tangents since they are not used anyway
    return Interpolator.interpolate(values[a], 0, 0, values[b], t, animationReference.interpolationType);
  }
}
