import { Animation } from '../../parsers/mdlx/animations';
import SanityTestData from './data';
import EventObject from '../../parsers/mdlx/eventobject';
import { testReference } from './utils';

function getSequenceFromFrame(data: SanityTestData, frame: number, globalSequenceId: number) {
  if (globalSequenceId === -1) {
    let sequences = data.model.sequences;

    for (let i = 0, l = sequences.length; i < l; i++) {
      let interval = sequences[i].interval;

      if (frame >= interval[0] && frame <= interval[1]) {
        return i;
      }
    }
  } else {
    let end = data.model.globalSequences[globalSequenceId];

    if (frame >= 0 && frame <= end) {
      return globalSequenceId;
    }
  }

  return -1;
}

function seprateTracks(data: SanityTestData, frames: number[] | Uint32Array, globalSequenceId: number, separated: number[][]) {
  let lastFrame = -Infinity;

  for (let i = 0, l = frames.length; i < l; i++) {
    let frame = frames[i];

    data.assertWarning(frame >= 0, `Track ${i}: Negative frame`);

    if (frame === lastFrame) {
      data.addWarning(`Track ${i} has the same frame ${frame} as track ${i - 1}`);
    } else if (frame < lastFrame) {
      data.addSevere(`Track ${i} frame at ${frame} is lower than the track before it at ${lastFrame}`)
    }

    let sequence = getSequenceFromFrame(data, frame, globalSequenceId);

    if (sequence !== -1) {
      separated[sequence].push(i);
    } else {
      // Frame 0 seems to be special.
      // Or maybe it's the first keyframe regardless of the frame.
      // Who knows.
      if (frame !== 0 && frames.length > 1) {
        if (globalSequenceId === -1) {
          data.addUnused(`Track ${i}: Frame ${frame} is not in any sequence`);
        } else {
          data.addUnused(`Track ${i}: Frame ${frame} is not in global sequence ${globalSequenceId}`);
        }
      }
    }

    lastFrame = frame;
  }
}

function getSequenceName(data: SanityTestData, sequence: number, globalSequenceId: number) {
  if (globalSequenceId === -1) {
    return `sequence "${data.model.sequences[sequence].name}"`;
  } else {
    return `global sequence ${globalSequenceId}`;
  }
}

const EPSILON = 0.001;

function compareValues(a: Uint32Array | Float32Array, b: Uint32Array | Float32Array, c: Uint32Array | Float32Array) {
  for (let i = 0, l = a.length; i < l; i++) {
    let ai = a[i];

    if (Math.abs(ai - b[i]) > EPSILON || Math.abs(ai - c[i]) > EPSILON) {
      return false;
    }
  }

  return true;
}

function testSequenceTracks(data: SanityTestData, indices: number[], sequence: number, globalSequenceId: number, interpolationType: number, frames: number[] | Uint32Array, values: (Uint32Array | Float32Array)[] | undefined) {
  let start = 0;
  let end;

  if (globalSequenceId === -1) {
    let interval = data.model.sequences[sequence].interval;

    start = interval[0];
    end = interval[1];
  } else {
    end = data.model.globalSequences[globalSequenceId];
  }

  let first = frames[indices[0]];
  let last = frames[indices[indices.length - 1]];

  // Missing the opening/closing tracks for a specific sequence can sometimes cause weird animations in the game.
  // Generally speaking these warnings can be ignored though.
  data.assertWarning(first === start, `No opening track for ${getSequenceName(data, sequence, globalSequenceId)} at frame ${start}`);
  // If there is no interpolation, then it doesn't matter if there's a closing track or not.
  data.assertWarning(last === end || interpolationType === 0, `No closing track for ${getSequenceName(data, sequence, globalSequenceId)} at frame ${end}`);

  if (values) {
    // Check for consecutive tracks with the same values.
    if (indices.length > 2) {
      let a = values[indices[0]];
      let b = values[indices[1]];

      for (let i = 2, l = indices.length; i < l; i++) {
        let c = values[indices[i]];

        if (compareValues(a, b, c)) {
          let index = indices[i - 1];

          data.addUnused(`Track ${index} at frame ${frames[index]} has the same-ish value as tracks ${index - 1} and ${index + 1}`);
        }

        a = b;
        b = c;
      }
    }
  }
}

export default function testTracks(data: SanityTestData, object: Animation | EventObject) {
  let framesOrTracks;
  let interpolationType = 0;
  let values;

  if (object instanceof Animation) {
    data.assertWarning(object.frames.length > 0, 'Zero tracks');

    framesOrTracks = object.frames;
    interpolationType = object.interpolationType;
    values = object.values;
  } else {
    data.assertError(object.tracks.length > 0, 'Zero tracks');

    framesOrTracks = object.tracks;
  }

  let globalSequenceId = object.globalSequenceId;
  let separated: number[][] = [];

  if (globalSequenceId === -1) {
    data.assertWarning(data.model.sequences.length > 0, 'This animation exists, but the model has no sequences');

    for (let i = 0, l = data.model.sequences.length; i < l; i++) {
      separated.push([]);
    }
  } else if (testReference(data, data.model.globalSequences, globalSequenceId, 'global sequence')) {
    separated[globalSequenceId] = [];
  }

  seprateTracks(data, framesOrTracks, globalSequenceId, separated);

  for (let i = 0, l = separated.length; i < l; i++) {
    let indices = separated[i];

    if (indices && indices.length > 1) {
      testSequenceTracks(data, indices, i, globalSequenceId, interpolationType, framesOrTracks, values);
    }
  }
}
