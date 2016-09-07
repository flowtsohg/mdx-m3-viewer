function M3Sd(sd) {
    this.keys = sd.keys.getAll();
    this.values = sd.values.getAll();
    this.biggestKey = sd.biggestKey;
}

function M3SdContainer(sd) {
    this.sd = sd.map((sd) => new M3Sd(sd));
}

M3SdContainer.prototype = {
    getValue(index, animationReference, frame, runsConcurrent) {
        var sd = this.sd[index];

        if (runsConcurrent) {
            frame = frame % sd.biggestKey;
        }

        var keys = sd.keys;
        var values = sd.values;

        const interval = this.getInterval(keys, frame);

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
        return Interpolator.interpolate(values[a], 0, 0, values[b], t, animationReference.interpolationType);
    },

    getInterval(keys, frame) {
        var interval = vec2.heap;

        var a = keys.length;
        var b = 0;

        while (b !== keys.length && frame > keys[b]) {
            a = b;
            b++;
        }

        interval[0] = a;
        interval[1] = b;

        return interval;
    }
};
