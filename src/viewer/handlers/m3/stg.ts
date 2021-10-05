import M3ParserStg from '../../../parsers/m3/stg';
import { AnimationReference } from '../../../parsers/m3/animationreference';
import M3ModelInstance from './modelinstance';
import M3Sts from './sts';
import M3Stc from './stc';
import { quat, vec3 } from 'gl-matrix';

/**
 * M3 animation data getter.
 */
export default class M3Stg {
  name: string;
  stcIndices: Uint32Array;
  sts: M3Sts[];
  stc: M3Stc[];

  constructor(stg: M3ParserStg, sts: M3Sts[], stc: M3Stc[]) {
    this.name = <string>stg.name.get();
    this.stcIndices = <Uint32Array>stg.stcIndices.get();
    this.sts = sts;
    this.stc = stc;
  }

  getValueUnsafe(animRef: AnimationReference, instance: M3ModelInstance): number | vec3 | quat | Uint8Array | null {
    const stcIndices = this.stcIndices;
    const stcs = this.stc;
    const stss = this.sts;

    for (let i = 0, l = stcIndices.length; i < l; i++) {
      const stc = stcs[stcIndices[i]];
      const sts = stss[stc.stsIndex];

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
