import Interpolator from "../../src/math/interpolator";

/**
 * @constructor
 * @param {MdxSd} sd
 * @param {number} start
 * @param {number} end
 * @param {Array<MdxParserTrack>} keyframes
 * @param {boolean} isGlobalSequence
 */
function MdxSdSequence(sd, start, end, keyframes, isGlobalSequence) {
    var defval = sd.defval;

    this.sd = sd;
    this.start = start;
    this.end = end;
    this.keyframes = [];

    // When using a global sequence, where the first key is outside of the sequence's length, it becomes its constant value.
    // When having one key in the sequence's range, and one key outside of it, results seem to be non-deterministic.
    // Sometimes the second key is used too, sometimes not.
    // It also differs depending where the model is viewed - the WE previewer, the WE itself, or the game.
    // All three show different results, none of them make sense.
    // Therefore, only handle the case where the first key is outside.
    // This fixes problems spread over many models, e.g. HeroMountainKing (compare in WE and in Magos).
    if (isGlobalSequence && keyframes[0].frame > end) {
        this.keyframes.push(keyframes[0]);
    }

    // Go over the keyframes, and add all of the ones that are in this sequence (start <= frame <= end).
    for (var i = 0, l = keyframes.length; i < l; i++) {
        var keyframe = keyframes[i],
            frame = keyframe.frame;

        if (frame >= start && frame <= end) {
            this.keyframes.push(keyframe);
        }
    }

    switch (this.keyframes.length) {
        // If there are no keys, use the default value directly.
        case 0:
            this.constant = true;
            this.value = defval;
            break;

        // If there's only one key, use it directly.
        case 1:
            this.constant = true;
            this.value = this.keyframes[0].value;
            break;

        default:
            // If all of the values in this sequence are the same, might as well make it constant.
            var constant = true,
                firstValue = this.keyframes[0].value;

            for (var i = 1, l = this.keyframes.length; i < l; i++) {
                var keyframe = this.keyframes[i],
                    value = keyframe.value;

                if (value.length > 0) {
                    for (var j = 0, k = value.length; j < k; j++) {
                        if (firstValue[j] !== value[j]) {
                            constant = false;
                            break;
                        }
                    }
                } else {
                    if (value !== firstValue) {
                        constant = false;
                        break;
                    }
                }
            }

            if (constant) {
                this.constant = true;
                this.value = firstValue;
            } else {
                this.constant = false;

                // If there is no opening keyframe for this sequence, inject one with the default value.
                if (this.keyframes[0].frame !== start) {
                    this.keyframes.splice(0, 0, { frame: start, value: defval, inTan: defval, outTan: defval });
                }

                // If there is no closing keyframe for this sequence, inject one with the default value.
                if (this.keyframes[this.keyframes.length - 1].frame !== end) {
                    this.keyframes.splice(this.keyframes.length, 0, { frame: end, value: this.keyframes[0].value, inTan: this.keyframes[0].outTan, outTan: this.keyframes[0].inTan });
                }
            }

            break;
    }
}

MdxSdSequence.prototype = {
    getValue(frame) {
        if (this.constant) {
            return this.value;
        } else {
            var keyframes = this.keyframes,
                l = keyframes.length;

            if (frame <= this.start) {
                return keyframes[0].value;
            } else if (frame >= this.end) {
                return keyframes[l - 1].value;
            } else {
                for (var i = 1; i < l; i++) {
                    var keyframe = keyframes[i];

                    if (keyframe.frame > frame) {
                        var lastKeyframe = keyframes[i - 1];

                        var t = Math.clamp((frame - lastKeyframe.frame) / (keyframe.frame - lastKeyframe.frame), 0, 1);

                        return Interpolator.interpolate(lastKeyframe.value, lastKeyframe.outTan, keyframe.inTan, keyframe.value, t, this.sd.interpolationType);
                    }
                }
            }
        }
    },

    getKeyframe(frame) {
        if (this.constant) {
            return 0;
        } else {
            var keyframes = this.keyframes,
                l = keyframes.length;

            if (frame <= this.start) {
                return 0
            } else if (frame >= this.end) {
                return l - 1;
            } else {
                for (var i = 1; i < l; i++) {
                    var keyframe = keyframes[i];

                    if (keyframe.frame > frame) {
                        return i;
                    }
                }
            }
        }
    }
};

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserSd} sd
 */
function MdxSd(model, sd) {
    var globalSequenceId = sd.globalSequenceId,
        globalSequences = model.globalSequences,
        tracks = sd.tracks,
        forcedInterp = MdxSd.forcedInterp[sd.tag];

    this.tag = sd.tag;
    this.model = model;
    this.keyframes = tracks;
    this.defval = sd.defval;

    // Allow to force an interpolation type.
    // The game seems to do this with visibility tracks, where the type is forced to None.
    // It came up as a bug report by a user who used the wrong interpolation type.
    this.interpolationType = forcedInterp !== undefined ? forcedInterp : sd.interpolationType;

    if (globalSequenceId !== -1 && globalSequences) {
        this.globalSequence = new MdxSdSequence(this, 0, globalSequences[globalSequenceId].value, tracks, true);
    } else {
        var sequences = model.sequences;

        this.sequences = [];

        for (var i = 0, l = sequences.length; i < l; i++) {
            var interval = sequences[i].interval;

            this.sequences[i] = new MdxSdSequence(this, interval[0], interval[1], tracks, false);
        }
    }
}

MdxSd.forcedInterp = {
    KLAV: 0,
    KATV: 0,
    KPEV: 0,
    KP2V: 0,
    KRVS: 0
};

MdxSd.prototype = {
    getValue(instance) {
        if (this.globalSequence) {
            var globalSequence = this.globalSequence;

            return globalSequence.getValue(instance.counter % globalSequence.end);
        } else if (instance.sequence !== -1) {
            return this.sequences[instance.sequence].getValue(instance.frame);
        } else {
            return this.defval;
        }
    },

    getKeyframe(instance) {
        if (this.globalSequence) {
            var globalSequence = this.globalSequence;

            return globalSequence.getKeyframe(instance.counter % globalSequence.end);
        } else if (instance.sequence !== -1) {
            return this.sequences[instance.sequence].getKeyframe(instance.frame);
        } else {
            return 0;
        }
    },

    isVariant(sequence) {
        if (this.globalSequence) {
            return !this.globalSequence.constant;
        } else {
            return !this.sequences[sequence].constant;
        }
    },

    getValues() {
        if (this.globalSequence) {
            var values = [],
                keyframes = this.globalSequence.keyframes;

            for (var i = 0, l = keyframes.length; i < l; i++) {
                values[i] = keyframes[i].value;
            }

            return values;
        } else {
            console.warn("[MdxSD::getValues] Called on an SD that doesn't use a global sequence")
            return [];
        }
    }
};

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserSdContainer} container
 */
function MdxSdContainer(model, container) {
    let sd = {};

    // The SD container doesn't exist if a model had no nodes, and a fake node was injected.
    if (container) {
        let elements = container.elements;

        for (let i = 0, l = elements.length; i < l; i++) {
            let element = elements[i];

            sd[element.tag] = new MdxSd(model, element);
        }
    }

    this.sd = sd;
}

MdxSdContainer.prototype = {
    getValues(tag) {
        var sd = this.sd[tag];

        if (sd) {
            return sd.getValues();
        }

        return [];
    },

    getValue(tag, instance, defval) {
        var sd = this.sd[tag];

        if (sd) {
            return sd.getValue(instance);
        }

        return defval;
    },

    getKeyframe(tag, instance) {
        var sd = this.sd[tag];

        if (sd) {
            return sd.getKeyframe(instance);
        }

        return 0;
    },

    isVariant(tag, sequence) {
        var sd = this.sd[tag];

        if (sd) {
            return sd.isVariant(sequence);
        }

        return false;
    }
};

export default MdxSdContainer;
