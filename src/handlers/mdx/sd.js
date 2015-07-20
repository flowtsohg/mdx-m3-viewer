Mdx.SD = function (tracks, model) {
    var i, l, arr, keys;
    
    this.defval = tracks.defval;
    this.interpolationType = tracks.interpolationType;
    this.globalSequenceId = tracks.globalSequenceId;
    this.globalSequences = model.globalSequences;
    this.sequences = model.sequences;
    
    arr = tracks.tracks;
    l = arr.length;

    keys = [];
    keys.length = l;


    for (i = 0; i < l; i++) {
        keys[i] = arr[i].frame;
    }

    this.tracks = arr;
    this.keys = keys;

    // Avoid heap allocations in getInterval()
    this.interval = [0, 0];
    
    this.tempVector = new Float32Array(this.defval.length);

    this.fillSequences();
};

Mdx.SD.prototype = {
    insertFrame: function (frame, frame0) {
        var defval = this.defval,
            tracks = this.tracks,
            keys = this.keys,
            l = keys.length,
            key;
        
        for (var i = 0; i < l; i++) {
            key = keys[i];
            
            if (key === frame) {
                return;
            }
            
            if (key > frame) {
                keys.splice(i, 0, frame);
                tracks.splice(i, 0, {frame: frame, data: frame0, inTan: frame0, outTan: frame0});
                return;
            }
        }
        
        keys.splice(l, 0, frame);
        tracks.splice(l, 0, { frame: frame, data: frame0, inTan: frame0, outTan: frame0 });
    },
    
    calculateFirstSeqFrame: function (firstFrames, interval) {
        var keys = this.keys;
        var tracks = this.tracks;
        
        if (tracks[0].frame === 0) {
            firstFrames.push(tracks[0].data);
            return;
        }
        
        for (var i = 0, l = keys.length; i < l; i++) {
            if (keys[i] >= interval[0] && keys[i] <= interval[1]) {
                firstFrames.push(tracks[i].data);
                return;
            }
        }
        
        firstFrames.push(this.defval);
    },
    
    calculateFirstFrames: function () {
        var sequences = this.sequences;
        var interval;
        var firstFrames = [];
        
        for (var i = 0, l = sequences.length; i < l; i++) {
            interval = sequences[i].interval;
            
            this.calculateFirstSeqFrame(firstFrames, interval);
        }
        
        return firstFrames;
    },
    
    fillSequences: function () {
        var sequences = this.sequences;
        var interval;
        var firstFrames = this.calculateFirstFrames();
        
        for (var i = 0, l = sequences.length; i < l; i++) {
            interval = sequences[i].interval;
            
            this.insertFrame(interval[0], firstFrames[i]);
            this.insertFrame(interval[1], firstFrames[i]);
        }
    },
    
    getInterval: function (frame, start, end, interval) {
        //~ var keys = this.keys;
        //~ var length = keys.length;
        //~ var a = length;
        //~ var b = 0;

        //~ while (b !== length && frame > keys[b]) {
            //~ a = b;
            //~ b++;
        //~ }

        //~ if ((a !== length) && (keys[a] < start)) {
            //~ a = length;
        //~ }

        //~ if ((b !== length) && (keys[b] > end)) {
            //~ b = length;
        //~ }

        //~ interval[0] = a;
        //~ interval[1] = b;
        
        var keys = this.keys;
        var i;
        var l = keys.length;
        
        if (frame < start) {
            for (i = 0; i < l; i++) {
                if (keys[i] === start) {
                    interval[0] = i;
                    interval[1] = i;
                    return;
                }
            }
        }
        
        if (frame > end) {
             for (i = 0; i < l; i++) {
                if (keys[i] === end) {
                    interval[0] = i;
                    interval[1] = i;
                    return;
                }
            }
        }
        
        for (i = 0; i < l; i++) {
            if (keys[i] > frame) {
                interval[0] = i - 1;
                interval[1] = i;
                return;
            }
        }
    },

    getValueAtTime: function (frame, start, end) {
        var interval = this.interval;

        this.getInterval(frame, start, end, interval);
        
        if (interval[0] === -1) {
            interval[0] = 0;
        }
        
        if (interval[1] === -1) {
            interval[1] = 0;
        }
        
        //~ var tracks = this.tracks;
        //~ var length = tracks.length;
        //~ var a = interval[0];
        //~ var b = interval[1];

        //~ if (a === length) {
            //~ return this.defval;
        //~ }
        
        //~ if (b === length) {
            //~ return tracks[a].vector;
        //~ }

        //~ a = tracks[a];
        //~ b = tracks[b];

        //~ if (a.frame >= b.frame) {
            //~ return a.vector;
        //~ }
        
        var tracks = this.tracks;
        var a = tracks[interval[0]];
        var b = tracks[interval[1]];
        var t;
        
        if (b.frame - a.frame > 0) {
            t = Math.min(Math.max((frame - a.frame) / (b.frame - a.frame), 0), 1);
        } else {
            t = 0;
        }
        
        return interpolator(this.tempVector, a.data, a.outTan, b.inTan, b.data, t, this.interpolationType);
    },

    getDefval: function () {
        var tempVector = this.tempVector,
            defval = this.defval,
            length = defval.length;

        if (length === 1) {
            return defval[0];
        } else if (length === 3) {
            vec3.copy(tempVector, defval);
        } else if (length === 4) {
            vec4.copy(tempVector, defval);
        }

        return tempVector;
    },

    // The frame argument is the current animation frame
    // The counter argument is a counter that always goes up to infinity, and is used for global sequences
    getValue: function (sequence, frame, counter) {
        if (this.globalSequenceId !== -1 && this.globalSequences) {
            var duration = this.globalSequences[this.globalSequenceId].data;

            return this.getValueAtTime(counter % duration , 0, duration);
        } else if (sequence !== -1) {
            var interval = this.sequences[sequence].interval;
            return this.getValueAtTime(frame, interval[0], interval[1]);
        } else {
            return this.getDefval();
        }
    }
};

Mdx.SDContainer = function (container, model) {
    var tracks = container.sd;
    var keys = Object.keys(tracks || {});
    var sd = {};
    var type;

    for (var i = 0, l = keys.length; i < l; i++) {
        type = keys[i];

        sd[type] = new Mdx.SD(tracks[type], model);
    }

    this.sd = sd;
};

Mdx.SDContainer.prototype = {
    getValue: function (sd, sequence, frame, counter, defval) {
        if (sd) {
            return sd.getValue(sequence, frame, counter);
        }

        return defval;
    },

    getKMTF: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KMTF, sequence, frame, counter, defval);
    },

    getKMTA: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KMTA, sequence, frame, counter, defval);
    },

    getKTAT: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KTAT, sequence, frame, counter, defval);
    },

    getKTAR: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KTAR, sequence, frame, counter, defval);
    },

    getKTAS: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KTAS, sequence, frame, counter, defval);
    },

    getKGAO: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KGAO, sequence, frame, counter, defval);
    },

    getKGAC: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KGAC, sequence, frame, counter, defval);
    },

    getKLAS: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KLAS, sequence, frame, counter, defval);
    },

    getKLAE: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KLAE, sequence, frame, counter, defval);
    },

    getKLAC: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KLAC, sequence, frame, counter, defval);
    },

    getKLAI: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KLAI, sequence, frame, counter, defval);
    },

    getKLBI: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KLBI, sequence, frame, counter, defval);
    },

    getKLBC: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KLBC, sequence, frame, counter, defval);
    },

    getKLAV: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KLAV, sequence, frame, counter, defval);
    },

    getKATV: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KATV, sequence, frame, counter, defval);
    },

    getKPEE: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KPEE, sequence, frame, counter, defval);
    },

    getKPEG: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KPEG, sequence, frame, counter, defval);
    },

    getKPLN: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KPLN, sequence, frame, counter, defval);
    },

    getKPLT: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KPLT, sequence, frame, counter, defval);
    },

    getKPEL: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KPEL, sequence, frame, counter, defval);
    },

    getKPES: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KPES, sequence, frame, counter, defval);
    },

    getKPEV: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KPEV, sequence, frame, counter, defval);
    },

    getKP2S: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KP2S, sequence, frame, counter, defval);
    },

    getKP2R: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KP2R, sequence, frame, counter, defval);
    },

    getKP2L: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KP2L, sequence, frame, counter, defval);
    },

    getKP2G: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KP2G, sequence, frame, counter, defval);
    },

    getKP2E: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KP2E, sequence, frame, counter, defval);
    },

    getKP2N: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KP2N, sequence, frame, counter, defval);
    },

    getKP2W: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KP2W, sequence, frame, counter, defval);
    },

    getKP2V: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KP2V, sequence, frame, counter, defval);
    },

    getKRHA: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KRHA, sequence, frame, counter, defval);
    },

    getKRHB: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KRHB, sequence, frame, counter, defval);
    },

    getKRAL: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KRAL, sequence, frame, counter, defval);
    },

    getKRCO: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KRCO, sequence, frame, counter, defval);
    },

    getKRTX: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KRTX, sequence, frame, counter, defval);
    },

    getKRVS: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KRVS, sequence, frame, counter, defval);
    },

    getKCTR: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KCTR, sequence, frame, counter, defval);
    },

    getKTTR: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KTTR, sequence, frame, counter, defval);
    },

    getKCRL: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KCRL, sequence, frame, counter, defval);
    },

    getKGTR: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KGTR, sequence, frame, counter, defval);
    },

    getKGRT: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KGRT, sequence, frame, counter, defval);
    },

    getKGSC: function (sequence, frame, counter, defval) {
        return this.getValue(this.sd.KGSC, sequence, frame, counter, defval);
    }
};
