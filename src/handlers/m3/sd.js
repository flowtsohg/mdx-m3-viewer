M3.SD = function (sd) {
    this.sd = sd;

    // Avoid heap allocations in getInterval()
    this.interval = [0, 0];
};

M3.SD.prototype = {
    getValue: function (out, index, animationReference, frame, runsConcurrent) {
        var sd = this.sd[index];

        if (runsConcurrent === 1) {
            frame = frame % sd.biggestKey;
        }

        var interval = this.interval;
        var keys = sd.keys;
        var values = sd.values;

        this.getInterval(keys, frame, interval);

        var a = interval[0];
        var b = interval[1];
        var length = keys.length;

        if (a === length) {
            if (b === length) {
                return animationReference.initValue;
            } else {
                return values[b];
            }
        }

        if (b === length || a >= b) {
            return values[a];
        }

        var t = Math.clamp((frame - keys[a]) / (keys[b] - keys[a]), 0, 1);

        // M3 doesn't seem to have hermite/bezier interpolations, so just feed 0 to the in/out tangents since they are not used anyway
        return interpolator(out, values[a], 0, 0, values[b], t, animationReference.interpolationType);
    },

    getInterval: function (keys, frame, interval) {
        var a = keys.length;
        var b = 0;

        while (b !== keys.length && frame > keys[b]) {
            a = b;
            b++;
        }

        interval[0] = a;
        interval[1] = b;
    }
};
