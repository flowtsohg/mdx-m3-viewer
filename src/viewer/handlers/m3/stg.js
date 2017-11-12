/**
 * @constructor
 * @param {M3ParserStg} stg
 * @param {Array<M3Sts>} sts
 * @param {Array<M3Stc>} stc
 */
function M3Stg(stg, sts, stc) {
    this.name = stg.name.getAll().join('');
    this.stcIndices = stg.stcIndices.getAll();
    this.sts = sts;
    this.stc = stc;
}

M3Stg.prototype = {
    getValueUnsafe(animRef, instance) {
        let stcIndices = this.stcIndices,
            stcs = this.stc,
            stss = this.sts;

        for (let i = 0, l = stcIndices.length; i < l; i++) {
            let stc = stcs[stcIndices[i]],
                sts = stss[stc.stsIndex];

            // First check if this STC actually has data for this animation reference
            if (sts.hasData(animRef)) {
                // Since this STC has data for this animation reference, return it
                return stc.getValueUnsafe(animRef, instance);
            }
        }

        // No STC referenced by the STG had data for this animation reference
        return animRef.initValue;
    }
};

export default M3Stg;
