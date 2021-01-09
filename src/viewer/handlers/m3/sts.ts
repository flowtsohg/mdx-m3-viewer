import M3ParserSts from '../../../parsers/m3/sts';
import { AnimationReference } from '../../../parsers/m3/animationreference';

/**
 * M3 animation data validator.
 */
export default class M3Sts {
  animIds: object;

  constructor(sts: M3ParserSts) {
    this.animIds = {};

    let animIds = <Uint32Array>sts.animIds.get();

    // Allows direct checks instead of loops
    for (let i = 0, l = animIds.length; i < l; i++) {
      this.animIds[animIds[i]] = i;
    }
  }

  hasData(animRef: AnimationReference) {
    return !!this.animIds[animRef.animId];
  }
}
