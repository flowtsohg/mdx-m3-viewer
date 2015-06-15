Mdx.SD = function (tracks, model) {
    var i, l, arr, keys;
    
    this.type = tracks.type;
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
                tracks.splice(i, 0, {frame: frame, vector: frame0, inTan: frame0, outTan: frame0});
                return;
            }
        }
        
        keys.splice(l, 0, frame);
        tracks.splice(l, 0, {frame: frame, vector: frame0, inTan: frame0, outTan: frame0});
    },
    
    calculateFirstSeqFrame: function (firstFrames, interval) {
        var keys = this.keys;
        var tracks = this.tracks;
        
        if (tracks[0].frame === 0) {
            firstFrames.push(tracks[0].vector);
            return;
        }
        
        for (var i = 0, l = keys.length; i < l; i++) {
            if (keys[i] >= interval[0] && keys[i] <= interval[1]) {
                firstFrames.push(tracks[i].vector);
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

    getValueAtTime: function (out, frame, start, end) {
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
            t = Math.clamp((frame - a.frame) / (b.frame - a.frame), 0, 1);
        } else {
            t = 0;
        }
        
        return interpolator(out, a.vector, a.outTan, b.inTan, b.vector, t, this.interpolationType);
    },

    // The frame argument is the current animation frame
    // The counter argument is a counter that always goes up to infinity, and is used for global sequences
    getValue: function (out, sequence, frame, counter) {
        if (this.globalSequenceId !== -1 && this.globalSequences) {
            var duration = this.globalSequences[this.globalSequenceId];

            return this.getValueAtTime(out, counter % duration , 0, duration);
        } else if (sequence !== -1) {
            var interval = this.sequences[sequence].interval;
            //console.log("[getValue]", frame, interval[0], interval[1]);
            return this.getValueAtTime(out, frame, interval[0], interval[1]);
        } else {
            return this.defval;
        }
    }
};

Mdx.getSDValue = function (sequence, frame, counter, sd, defval, out) {
    if (sd) {
        return sd.getValue(out, sequence, frame, counter);
    } else {
        return defval;
    }
};

Mdx.parseSDTracks = function (tracks, model) {
    var keys = Object.keys(tracks);
    var sds = {};
    var type;
    
    for (var i = 0, l = keys.length; i < l; i++) {
        type = keys[i];
        
        sds[type] = new Mdx.SD(tracks[type], model);
    }

    return sds;
};