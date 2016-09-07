function M3Sts(sts) {
    const animIds = sts.animIds.getAll();

    this.animIds = {};

    // Allows direct checks instead of loops
    for (let i = 0, l = animIds.length; i < l; i++) {
        this.animIds[animIds[i]] = i;
    }
}

M3Sts.prototype = {
    hasData(animRef) {
        return !!this.animIds[animRef.animId];
    }
};
