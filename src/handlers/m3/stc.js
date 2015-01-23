function STC(stc) {
    var i, l;
    var animIds = stc.animIds;

    this.name = stc.name;
    this.runsConcurrent = stc.runsConcurrent;
    this.priority = stc.priority;
    this.stsIndex = stc.stsIndex;
    this.animIds = {};

    // Allows direct checks instead of loops
    for (i = 0, l = animIds.length; i < l; i++) {
        this.animIds[animIds[i]] = i;
    }

    this.animRefs = stc.animRefs;

    var sd = stc.sd;

    this.sd = [
        new SD(sd[0]),
        new SD(sd[1]),
        new SD(sd[2]),
        new SD(sd[3]),
        new SD(sd[4]),
        new SD(sd[5]),
        0, // Unknown SD
        new SD(sd[7]),
        new SD(sd[8]),
        0, // Unknown SD
        0, // Unknown SD,
        new SD(sd[11]),
        new SD(sd[12])
    ];
}

STC.prototype = {
    getValue: function (out, animationReference, frame) {
        var animRef = this.animRefs[this.animIds[animationReference.animId]];

        if (animRef) {
            return this.sd[animRef[1]].getValue(out, animRef[0], animationReference, frame, this.runsConcurrent);
        }

        return animationReference.initValue;
    }
};