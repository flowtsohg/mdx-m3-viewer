// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function getInterval(tracks, time, start, end) {
  var a = tracks.length;
  var b = 0;
  
  while (b !== tracks.length && time > tracks[b].time) {
    a = b;
    b++;
  }
  
  if ((a !== tracks.length) && (tracks[a].time < start)) {
    a = tracks.length;
  }
  
  if ((b !== tracks.length) && (tracks[b].time > end)) {
    b = tracks.length;
  }
  
  return [a, b];
}

function getTrackAtTime(tracks, interpolationType, time, start, end, defval) {
  var interval = getInterval(tracks, time, start, end);
  var length = tracks.length;
  var a = interval[0];
  var b = interval[1];
  
  if (a === length) {
    if (b === length) {
      return defval;
    } else {
      return tracks[b].vector;
    }
  }
  
  if (b === length) {
    return tracks[a].vector;
  }
  
  a = tracks[a];
  b = tracks[b];
  
  if (a.time >= b.time) {
    return a.vector;
  }
  
  var t = math.clamp((time - a.time) / (b.time - a.time), 0, 1);
  var func = typeof a.vector === "number" ? math.interpolator.scalar : (a.vector.length === 3 ? math.interpolator.vector : math.interpolator.quaternion);
  
  return func(a.vector, a.outTan, b.inTan, b.vector, t, interpolationType);
}

 function getTrack(tracks, defval, model) {
  if (tracks) {
    if (tracks.globalSequenceId !== 4294967295) {
      var duration = model.globalSequences[tracks.globalSequenceId];
          
      return getTrackAtTime(tracks.tracks, tracks.interpolationType, model.time % duration , 0, duration, defval);
    } else if (model.sequence) {
      var interval = model.sequence.interval;
      
      return getTrackAtTime(tracks.tracks, tracks.interpolationType, model.frame, interval[0], interval[1], defval);
    }
  }
  
  return defval;
}