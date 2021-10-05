import M3ParserSts from '../../../parsers/m3/sts';
import { AnimationReference } from '../../../parsers/m3/animationreference';

/**
 * M3 animation data validator.
 */
export default class M3Sts {
  animIds = new Map<number, number>();

  constructor(sts: M3ParserSts) {
    const animIds = <Uint32Array>sts.animIds.get();

    // Allows direct checks instead of loops
    for (let i = 0, l = animIds.length; i < l; i++) {
      this.animIds.set(animIds[i], i);
    }
  }

  hasData(animRef: AnimationReference): boolean {
    return this.animIds.has(animRef.animId);
  }
}
