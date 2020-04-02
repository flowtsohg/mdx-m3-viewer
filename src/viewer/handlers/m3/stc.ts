import M3ParserStc from '../../../parsers/m3/stc';
import { M3ParserAnimationReference } from '../../../parsers/m3/animationreference';
import M3ModelInstance from './modelinstance';
import M3SdContainer from './sd';
import M3ParserSd from '../../../parsers/m3/sd';

/**
 * M3 sequence data.
 */
export default class M3Stc {
  name: string;
  runsConcurrent: number;
  priority: number;
  stsIndex: number;
  animRefs: any[];
  sd: M3SdContainer[];

  constructor(stc: M3ParserStc) {
    const animIds = stc.animIds.getAll();

    this.name = stc.name.getAll().join('');
    this.runsConcurrent = stc.runsConcurrent;
    this.priority = stc.priority;
    this.stsIndex = stc.stsIndex;

    let uints = <Uint32Array>stc.animRefs.getAll();
    const animRefs = new Uint16Array(uints.buffer);

    this.animRefs = [];

    // Allows direct checks instead of loops
    for (let i = 0, l = animIds.length; i < l; i++) {
      this.animRefs[animIds[i]] = [animRefs[i * 2 + 1], animRefs[i * 2]];
    }

    this.sd = stc.sd.map((sd) => new M3SdContainer(<M3ParserSd[]>sd.getAll()));
  }

  getValueUnsafe(animRef: M3ParserAnimationReference, instance: M3ModelInstance) {
    const ref = this.animRefs[animRef.animId];

    if (ref) {
      return this.sd[ref[0]].getValueUnsafe(ref[1], animRef, instance.frame, this.runsConcurrent);
    }

    return animRef.initValue;
  }
}
