import M3ParserStg from '../../../parsers/m3/stg';
import { M3ParserAnimationReference } from '../../../parsers/m3/animationreference';
import M3ModelInstance from './modelinstance';
import M3Sts from './sts';
import M3Stc from './stc';

/**
 * M3 animation data getter.
 */
export default class M3Stg {
  name: string;
  stcIndices: Uint32Array;
  sts: M3Sts[];
  stc: M3Stc[];

  constructor(stg: M3ParserStg, sts: M3Sts[], stc: M3Stc[]) {
    this.name = stg.name.getAll().join('');
    this.stcIndices = <Uint32Array>stg.stcIndices.getAll();
    this.sts = sts;
    this.stc = stc;
  }

  getValueUnsafe(animRef: M3ParserAnimationReference, instance: M3ModelInstance) {
    let stcIndices = this.stcIndices;
    let stcs = this.stc;
    let stss = this.sts;

    for (let i = 0, l = stcIndices.length; i < l; i++) {
      let stc = stcs[stcIndices[i]];
      let sts = stss[stc.stsIndex];

      // First check if this STC actually has data for this animation reference
      if (sts.hasData(animRef)) {
        // Since this STC has data for this animation reference, return it
        return stc.getValueUnsafe(animRef, instance);
      }
    }

    // No STC referenced by the STG had data for this animation reference
    return animRef.initValue;
  }
}
