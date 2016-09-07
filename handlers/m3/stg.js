function M3Stg(stg, sts, stc) {
    this.name = stg.name.getAll();
    this.stcIndices = stg.stcIndices.getAll();
    this.sts = sts;
    this.stc = stc;
}

M3Stg.prototype = {
    getValue(animRef, instance) {
        const stcIndices = this.stcIndices,
            stcs = this.stc,
            stss = this.sts;

        for (let i = 0, l = stcIndices.length; i < l; i++) {
            const stc = stcs[stcIndices[i]];
                sts = stss[stc.stsIndex];

            // First check if this STC actually has data for this animation reference
            if (sts.hasData(animRef)) {
                // Since this STC has data for this animation reference, return it
                return stc.getValue(animRef, instance);
            }
        }

        // No STC referenced by the STG had data for this animation reference
        return animRef.initValue;
    }
};
