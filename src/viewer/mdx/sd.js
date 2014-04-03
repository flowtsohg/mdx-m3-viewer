// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function SD(tracks, model) {
  this.type = tracks.type;
  this.defval = tracks.defval;
  this.interpolationType = tracks.interpolationType;
  this.globalSequenceId = tracks.globalSequenceId;
  this.tracks = tracks.tracks;
  this.sequences = model.sequences;
  this.globalSequences = model.globalSequences;
}

SD.prototype = {
  getInterval: function (frame, start, end) {
    var tracks = this.tracks;
    var a = tracks.length;
    var b = 0;
    
    while (b !== tracks.length && frame > tracks[b].frame) {
      a = b;
      b++;
    }
    
    if ((a !== tracks.length) && (tracks[a].frame < start)) {
      a = tracks.length;
    }
    
    if ((b !== tracks.length) && (tracks[b].frame > end)) {
      b = tracks.length;
    }
    
    return [a, b];
  },

  getValueAtTime: function (frame, start, end) {
    var interval = this.getInterval(frame, start, end);
    var tracks = this.tracks;
    var length = tracks.length;
    var a = interval[0];
    var b = interval[1];
    
    if (a === length) {
      if (b === length) {
        return this.defval;
      } else {
        return tracks[b].vector;
      }
    }
    
    if (b === length) {
      return tracks[a].vector;
    }
    
    a = tracks[a];
    b = tracks[b];
    
    if (a.frame >= b.frame) {
      return a.vector;
    }
    
    var t = math.clamp((frame - a.frame) / (b.frame - a.frame), 0, 1);
    var func = typeof a.vector === "number" ? math.interpolator.scalar : (a.vector.length === 3 ? math.interpolator.vector : math.interpolator.quaternion);
    
    return func(a.vector, a.outTan, b.inTan, b.vector, t, this.interpolationType);
  },
  
  // The frame argument is the current animation frame
  // The counter argument is a counter that always goes up to infinity, and is used for global sequences
  getValue: function (sequence, frame, counter) {
     if (this.globalSequenceId !== -1 && this.globalSequences) {
      var duration = this.globalSequences[this.globalSequenceId];
      
      return this.getValueAtTime(counter % duration , 0, duration);
    } else if (sequence !== -1) {
      var interval = this.sequences[sequence].interval;
      
      return this.getValueAtTime(frame, interval[0], interval[1]);
    } else {
      return this.defval;
    }
  }
};

function getSDValue(sequence, frame, counter, sd, defval) {
  if (sd) {
    return sd.getValue(sequence, frame, counter);
  } else {
    return defval;
  }
}

function parseSDTracks(tracks, model) {
  var keys = Object.keys(tracks);
  var sds = {};
  
  for (var i = 0, l = keys.length; i < l; i++) {
    var type = keys[i];
    
    sds[type] = new SD(tracks[type], model);
  }
  
  return sds;
}