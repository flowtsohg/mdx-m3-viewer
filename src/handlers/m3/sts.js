M3.STS = function (sts) {
    var i, l;
    var animIds = sts.animIds;

    this.animIds = {};

    // Allows direct checks instead of loops
    for (i = 0, l = animIds.length; i < l; i++) {
        this.animIds[animIds[i]] = i;
    }
};

M3.STS.prototype = {
    hasData: function (animationReference) {
        return !!this.animIds[animationReference.animId];
    }
};
