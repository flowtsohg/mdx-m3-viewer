M3.STG = function (stg, sts, stc) {
    this.name = stg.name;
    this.stcIndices = stg.stcIndices;
    this.sts = sts;
    this.stc = stc;
};

M3.STG.prototype = {
    getValue: function (out, animationReference, frame) {
        var i, l;
        var stcIndices = this.stcIndices;
        var stc;
        var sts;

        for (i = 0, l = stcIndices.length; i < l; i++) {
            stc = this.stc[stcIndices[i]];
            sts = this.sts[stc.stsIndex];

            // First check if this STC actually has data for this animation reference
            if (sts.hasData(animationReference)) {
                // Since this STC has data for this animation reference, return it
                return stc.getValue(out, animationReference, frame);
            }
        }

        // No STC referenced by the STG had data for this animation reference
        return animationReference.initValue;
    }
};
