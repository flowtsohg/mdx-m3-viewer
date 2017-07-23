import { vec3 } from "gl-matrix";
import Interpolator from "../../math/interpolator";

/**
 * @constructor
 * @param {M3ParserSd} sd
 */
function M3Sd(sd) {
    this.keys = sd.keys.getAll();
    this.values = sd.values.getAll();
    this.biggestKey = sd.biggestKey;
}

/**
 * @constructor
 * @param {Array<M3ParserSd>} sd
 */
function M3SdContainer(sd) {
    this.sd = sd.map((sd) => new M3Sd(sd));
}

M3SdContainer.prototype = {
    getValueUnsafe(index, animationReference, frame, runsConcurrent) {
        var sd = this.sd[index];

        if (runsConcurrent) {
            frame = frame % sd.biggestKey;
        }

        var keys = sd.keys;
        var values = sd.values;

        // getInterval
        var a = keys.length;
        var b = 0;

        while (b !== keys.length && frame > keys[b]) {
            a = b;
            b++;
        }
        // /getInterval

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
    }
};

export default M3SdContainer;
