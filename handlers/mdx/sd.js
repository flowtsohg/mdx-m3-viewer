function MdxSDSequence(sd, start, end, keyframes) {
    var defval = sd.defval;

    this.sd = sd;
    this.start = start;
    this.end = end;
    this.keyframes = [];

    for (var i = 0, l = keyframes.length; i < l; i++) {
        var keyframe = keyframes[i],
            frame = keyframe.frame,
            value = keyframe.value;

        if (frame >= start && frame <= end) {
            this.keyframes.push(keyframe);
        }
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

    //console.log(sequence, this.keyframes, defval)
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
    var i, l, arr, keys;
    
    this.tag = sd.tag;
    this.model = model;
    this.keyframes = sd.tracks;
    this.defval = sd.defval;
    this.interpolationType = sd.interpolationType;
    
    if (sd.globalSequenceId !== -1 && model.globalSequences) {
        this.globalSequence = new MdxSDSequence(this, 0, model.globalSequences[sd.globalSequenceId].value, sd.tracks);
    } else {
        this.sequences = [];

        for (var i = 0, l = model.sequences.length; i < l; i++) {
            var interval = model.sequences[i].interval;

            this.sequences[i] = new MdxSDSequence(this, interval[0], interval[1], sd.tracks);
        }
    }
}

MdxSD.prototype = {
    getValue(instance) {
        if (this.globalSequence) {
            var globalSequence = this.globalSequence;

            return globalSequence.getValue(Date.now() % globalSequence.end);
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
    var tracks = container.sd;
    var keys = Object.keys(tracks || {});
    var sd = [];

    for (var i = 0, l = keys.length; i < l; i++) {
        var type = keys[i];
        var track = tracks[type];

        sd[track.sdIndex] = new MdxSD(track, model);
    }

    this.sd = sd;
}

MdxSdContainer.prototype = {
    getValue(i, instance, defval) {
        var sd = this.sd[i];

        if (sd) {
            return sd.getValue(instance);
        }

        return defval;
    },

    isVariant(i, sequence) {
        var sd = this.sd[i];

        if (sd) {
            return sd.isVariant(sequence);
        }

        return false;
    },

    getKMTFValue(instance, defval) {
        return this.getValue(0, instance, defval);
    },

    getKMTAValue(instance, defval) {
        return this.getValue(1, instance, defval);
    },

    getKTATValue(instance, defval) {
        return this.getValue(2, instance, defval);
    },

    getKTARValue(instance, defval) {
        return this.getValue(3, instance, defval);
    },

    getKTASValue(instance, defval) {
        return this.getValue(4, instance, defval);
    },

    getKGAOValue(instance, defval) {
        return this.getValue(5, instance, defval);
    },

    getKGACValue(instance, defval) {
        return this.getValue(6, instance, defval);
    },

    getKLASValue(instance, defval) {
        return this.getValue(7, instance, defval);
    },

    getKLAEValue(instance, defval) {
        return this.getValue(8, instance, defval);
    },

    getKLACValue(instance, defval) {
        return this.getValue(9, instance, defval);
    },

    getKLAIValue(instance, defval) {
        return this.getValue(10, instance, defval);
    },

    getKLBIValue(instance, defval) {
        return this.getValue(11, instance, defval);
    },

    getKLBCValue(instance, defval) {
        return this.getValue(12, instance, defval);
    },

    getKLAVValue(instance, defval) {
        return this.getValue(13, instance, defval);
    },

    getKATVValue(instance, defval) {
        return this.getValue(14, instance, defval);
    },

    getKPEEValue(instance, defval) {
        return this.getValue(15, instance, defval);
    },

    getKPEGValue(instance, defval) {
        return this.getValue(16, instance, defval);
    },

    getKPLNValue(instance, defval) {
        return this.getValue(17, instance, defval);
    },

    getKPLTValue(instance, defval) {
        return this.getValue(18, instance, defval);
    },

    getKPELValue(instance, defval) {
        return this.getValue(19, instance, defval);
    },

    getKPESValue(instance, defval) {
        return this.getValue(20, instance, defval);
    },

    getKPEVValue(instance, defval) {
        return this.getValue(21, instance, defval);
    },

    getKP2SValue(instance, defval) {
        return this.getValue(22, instance, defval);
    },

    getKP2RValue(instance, defval) {
        return this.getValue(23, instance, defval);
    },

    getKP2LValue(instance, defval) {
        return this.getValue(24, instance, defval);
    },

    getKP2GValue(instance, defval) {
        return this.getValue(25, instance, defval);
    },

    getKP2EValue(instance, defval) {
        return this.getValue(26, instance, defval);
    },

    getKP2NValue(instance, defval) {
        return this.getValue(27, instance, defval);
    },

    getKP2WValue(instance, defval) {
        return this.getValue(28, instance, defval);
    },

    getKP2VValue(instance, defval) {
        return this.getValue(29, instance, defval);
    },

    getKRHAValue(instance, defval) {
        return this.getValue(30, instance, defval);
    },

    getKRHBValue(instance, defval) {
        return this.getValue(31, instance, defval);
    },

    getKRALValue(instance, defval) {
        return this.getValue(32, instance, defval);
    },

    getKRCOValue(instance, defval) {
        return this.getValue(33, instance, defval);
    },

    getKRTXValue(instance, defval) {
        return this.getValue(34, instance, defval);
    },

    getKRVSValue(instance, defval) {
        return this.getValue(35, instance, defval);
    },

    getKCTRValue(instance, defval) {
        return this.getValue(36, instance, defval);
    },

    getKTTRValue(instance, defval) {
        return this.getValue(37, instance, defval);
    },

    getKCRLValue(instance, defval) {
        return this.getValue(38, instance, defval);
    },

    getKGTRValue(instance, defval) {
        return this.getValue(39, instance, defval);
    },

    getKGRTValue(instance, defval) {
        return this.getValue(40, instance, defval);
    },

    getKGSCValue(instance, defval) {
        return this.getValue(41, instance, defval);
    },

    isKMTFVariant(sequence) {
        return this.isVariant(0, sequence);
    },

    isKMTAVariant(sequence) {
        return this.isVariant(1, sequence);
    },

    isKTATVariant(sequence) {
        return this.isVariant(2, sequence);
    },

    isKTARVariant(sequence) {
        return this.isVariant(3, sequence);
    },

    isKTASVariant(sequence) {
        return this.isVariant(4, sequence);
    },

    isKGAOVariant(sequence) {
        return this.isVariant(5, sequence);
    },

    isKGACVariant(sequence) {
        return this.isVariant(6, sequence);
    },

    isKLASVariant(sequence) {
        return this.isVariant(7, sequence);
    },

    isKLAEVariant(sequence) {
        return this.isVariant(8, sequence);
    },

    isKLACVariant(sequence) {
        return this.isVariant(9, sequence);
    },

    isKLAIVariant(sequence) {
        return this.isVariant(10, sequence);
    },

    isKLBIVariant(sequence) {
        return this.isVariant(11, sequence);
    },

    isKLBCVariant(sequence) {
        return this.isVariant(12, sequence);
    },

    isKLAVVariant(sequence) {
        return this.isVariant(13, sequence);
    },

    isKATVVariant(sequence) {
        return this.isVariant(14, sequence);
    },

    isKPEEVariant(sequence) {
        return this.isVariant(15, sequence);
    },

    isKPEGVariant(sequence) {
        return this.isVariant(16, sequence);
    },

    isKPLNVariant(sequence) {
        return this.isVariant(17, sequence);
    },

    isKPLTVariant(sequence) {
        return this.isVariant(18, sequence);
    },

    isKPELVariant(sequence) {
        return this.isVariant(19, sequence);
    },

    isKPESVariant(sequence) {
        return this.isVariant(20, sequence);
    },

    isKPEVVariant(sequence) {
        return this.isVariant(21, sequence);
    },

    isKP2SVariant(sequence) {
        return this.isVariant(22, sequence);
    },

    isKP2RVariant(sequence) {
        return this.isVariant(23, sequence);
    },

    isKP2LVariant(sequence) {
        return this.isVariant(24, sequence);
    },

    isKP2GVariant(sequence) {
        return this.isVariant(25, sequence);
    },

    isKP2EVariant(sequence) {
        return this.isVariant(26, sequence);
    },

    isKP2NVariant(sequence) {
        return this.isVariant(27, sequence);
    },

    isKP2WVariant(sequence) {
        return this.isVariant(28, sequence);
    },

    isKP2VVariant(sequence) {
        return this.isVariant(29, sequence);
    },

    isKRHAVariant(sequence) {
        return this.isVariant(30, sequence);
    },

    isKRHBVariant(sequence) {
        return this.isVariant(31, sequence);
    },

    isKRALVariant(sequence) {
        return this.isVariant(32, sequence);
    },

    isKRCOVariant(sequence) {
        return this.isVariant(33, sequence);
    },

    isKRTXVariant(sequence) {
        return this.isVariant(34, sequence);
    },

    isKRVSVariant(sequence) {
        return this.isVariant(35, sequence);
    },

    isKCTRVariant(sequence) {
        return this.isVariant(36, sequence);
    },

    isKTTRVariant(sequence) {
        return this.isVariant(37, sequence);
    },

    isKCRLVariant(sequence) {
        return this.isVariant(38, sequence);
    },

    isKGTRVariant(sequence) {
        return this.isVariant(39, sequence);
    },

    isKGRTVariant(sequence) {
        return this.isVariant(40, sequence);
    },

    isKGSCVariant(sequence) {
        return this.isVariant(41, sequence);
    },

    getKMTF() {
        return this.sd[0];
    },

    getKMTA() {
        return this.sd[1];
    },

    getKTAT() {
        return this.sd[2];
    },

    getKTAR() {
        return this.sd[3];
    },

    getKTAS() {
        return this.sd[4];
    },

    getKGAO() {
        return this.sd[5];
    },

    getKGAC() {
        return this.sd[6];
    },

    getKLAS() {
        return this.sd[7];
    },

    getKLAE() {
        return this.sd[8];
    },

    getKLAC() {
        return this.sd[9];
    },

    getKLAI() {
        return this.sd[10];
    },

    getKLBI() {
        return this.sd[11];
    },

    getKLBC() {
        return this.sd[12];
    },

    getKLAV() {
        return this.sd[13];
    },

    getKATV() {
        return this.sd[14];
    },

    getKPEE() {
        return this.sd[15];
    },

    getKPEG() {
        return this.sd[16];
    },

    getKPLN() {
        return this.sd[17];
    },

    getKPLT() {
        return this.sd[18];
    },

    getKPEL() {
        return this.sd[19];
    },

    getKPES() {
        return this.sd[20];
    },

    getKPEV() {
        return this.sd[21];
    },

    getKP2S() {
        return this.sd[22];
    },

    getKP2R() {
        return this.sd[23];
    },

    getKP2L() {
        return this.sd[24];
    },

    getKP2G() {
        return this.sd[25];
    },

    getKP2E() {
        return this.sd[26];
    },

    getKP2N() {
        return this.sd[27];
    },

    getKP2W() {
        return this.sd[28];
    },

    getKP2V() {
        return this.sd[29];
    },

    getKRHA() {
        return this.sd[30];
    },

    getKRHB() {
        return this.sd[31];
    },

    getKRAL() {
        return this.sd[32];
    },

    getKRCO() {
        return this.sd[33];
    },

    getKRTX() {
        return this.sd[34];
    },

    getKRVS() {
        return this.sd[35];
    },

    getKCTR() {
        return this.sd[36];
    },

    getKTTR() {
        return this.sd[37];
    },

    getKCRL() {
        return this.sd[38];
    },

    getKGTR() {
        return this.sd[39];
    },

    getKGRT() {
        return this.sd[40];
    },

    getKGSC() {
        return this.sd[41];
    }
};
