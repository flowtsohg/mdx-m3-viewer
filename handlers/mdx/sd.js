function MdxSDSequence(sd, start, end, keyframes) {
    var defval = sd.defval;

    this.sd = sd;
    this.start = start;
    this.end = end;
    this.keyframes = [];

    // When using a global sequence with zero length, the first keyframe is used, regardless of its frame.
    // E.g. HeroMountainKing.
    if (end - start > 0) {
        for (var i = 0, l = keyframes.length; i < l; i++) {
            var keyframe = keyframes[i],
                frame = keyframe.frame,
                value = keyframe.value;

            if (frame >= start && frame <= end) {
                this.keyframes.push(keyframe);
            }
        }
    } else {
        this.keyframes.push(keyframes[0]);
    }

    switch (this.keyframes.length) {
        case 0:
            this.constant = true;
            this.value = defval;
            break;

        case 1:
            this.constant = true;
            this.value = this.keyframes[0].value;
            break;

        default:
            /// Mote: This code handles the case where there are multiple keyframes, but they all share the same value.
            ///       It's not really likely to happen, so I commented it for now.
            //var constant = true;
            //var firstValue = this.keyframes[0].value;

            //for (var i = 1, l = this.keyframes.length; i < l; i++) {
            //    var keyframe = this.keyframes[i],
            //        value = keyframe.value;

            //    if (typeof value === "number") {
            //        if (value !== firstValue) {
            //            constant = false;
            //            break;
            //        }
            //    } else {
            //        if (!Array.areEqual(value, firstValue)) {
            //            constant = false;
            //            break;
            //        }
            //    }
            //}

            //if (constant) {
            //    console.log("MISSED")
            //}

            this.constant = false;

            if (this.keyframes[0].frame !== start) {
                this.keyframes.splice(0, 0, { frame: start, value: defval, inTan: defval, outTan: defval });
            }

            if (this.keyframes[this.keyframes.length - 1].frame !== end) {
                // Swap the in/out tangents
                this.keyframes.splice(this.keyframes.length, 0, { frame: end, value: this.keyframes[0].value, inTan: this.keyframes[0].outTan, outTan: this.keyframes[0].inTan });
            }

            break;
    }
}

MdxSDSequence.prototype = {
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
    }
};

function MdxSD(sd, model) {
    var globalSequenceId = sd.globalSequenceId,
        globalSequences = model.globalSequences,
        tracks = sd.tracks;

    this.tag = sd.tag;
    this.model = model;
    this.keyframes = tracks;
    this.defval = sd.defval;
    this.interpolationType = sd.interpolationType;
    
    if (globalSequenceId !== -1 && globalSequences) {
        this.globalSequence = new MdxSDSequence(this, 0, globalSequences[globalSequenceId].value, tracks);
    } else {
        var sequences = model.sequences;

        this.sequences = [];

        for (var i = 0, l = sequences.length; i < l; i++) {
            var interval = sequences[i].interval;

            this.sequences[i] = new MdxSDSequence(this, interval[0], interval[1], tracks);
        }
    }
}

MdxSD.prototype = {
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

function MdxSdContainer(container, model) {
    var sd = [];

    // The SD container doesn't exist if a model had no nodes, and a fake node was injected.
    if (container) {
        var tracks = container.sd;
        var keys = Object.keys(tracks || {});

        for (var i = 0, l = keys.length; i < l; i++) {
            var type = keys[i];
            var track = tracks[type];

            sd[track.tag] = new MdxSD(track, model);
        }
    }

    this.sd = sd;
}

MdxSdContainer.prototype = {
    getValue(tag, instance, defval) {
        var sd = this.sd[tag];

        if (sd) {
            return sd.getValue(instance);
        }

        return defval;
    },

    isVariant(tag, sequence) {
        var sd = this.sd[tag];

        if (sd) {
            return sd.isVariant(sequence);
        }

        return false;
    }
};
