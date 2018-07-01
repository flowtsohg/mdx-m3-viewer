/**
 * M3 animation data getter.
 */
export default class M3Stg {
  /**
   * @param {M3ParserStg} stg
   * @param {Array<M3Sts>} sts
   * @param {Array<M3Stc>} stc
   */
  constructor(stg, sts, stc) {
    this.name = stg.name.getAll().join('');
    this.stcIndices = stg.stcIndices.getAll();
    this.sts = sts;
    this.stc = stc;
  }

  getValueUnsafe(animRef, instance) {
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
