import { Animation, InterpolationType } from '../../../parsers/mdlx/animations';
import EventObject from '../../../parsers/mdlx/eventobject';
import SanityTestData from './data';
import { testReference } from './utils';

function getSequenceFromFrame(data: SanityTestData, frame: number, globalSequenceId: number): number {
  if (globalSequenceId === -1) {
    const sequences = data.model.sequences;

    for (let i = 0, l = sequences.length; i < l; i++) {
      const interval = sequences[i].interval;

      if (frame >= interval[0] && frame <= interval[1]) {
        return i;
      }
    }
  } else {
    const end = data.model.globalSequences[globalSequenceId];

    if (frame >= 0 && frame <= end) {
      return globalSequenceId;
    }
  }

  return -1;
}

function seprateTracks(data: SanityTestData, frames: number[] | Uint32Array, globalSequenceId: number, separated: number[][]): void {
  let lastFrame = -Infinity;

  for (let i = 0, l = frames.length; i < l; i++) {
    const frame = frames[i];

    data.assertWarning(frame >= 0, `Track ${i} has a negative frame ${frame}`);

    if (frame === lastFrame) {
      data.addWarning(`Track ${i} has the same frame ${frame} as track ${i - 1}`);
    } else if (frame < lastFrame) {
      data.addSevere(`Track ${i} at frame ${frame} is lower than the track before it at ${lastFrame}`);
    }

    const sequence = getSequenceFromFrame(data, frame, globalSequenceId);

    if (sequence !== -1) {
      separated[sequence].push(i);
    } else {
      // Frame 0 seems to be special.
      // Or maybe it's the first keyframe regardless of the frame.
      // Who knows.
      if (frame !== 0 && frames.length > 1) {
        if (globalSequenceId === -1) {
          data.addUnused(`Track ${i} at frame ${frame} is not in any sequence`);
        } else {
          data.addUnused(`Track ${i} at frame ${frame} is not in global sequence ${globalSequenceId}`);
        }
      }
    }

    lastFrame = frame;
  }
}

function getSequenceName(data: SanityTestData, sequence: number, globalSequenceId: number): string {
  if (globalSequenceId === -1) {
    return `sequence "${data.model.sequences[sequence].name}"`;
  } else {
    return `global sequence ${globalSequenceId}`;
  }
}

const EPSILON = 0.001;

export function getValuesDiff(a: Uint32Array | Float32Array, b: Uint32Array | Float32Array, c: Uint32Array | Float32Array): number {
  let d = 0;

  for (let i = 0, l = a.length; i < l; i++) {
    const ai = a[i];
    const d1 = Math.abs(ai - b[i]);
    const d2 = Math.abs(ai - c[i]);

    if (d1 > d) {
      d = d1;
    }

    if (d2 > d) {
      d = d2;
    }
  }

  return d;
}

export function areValuesEqual(a: Uint32Array | Float32Array, b: Uint32Array | Float32Array): boolean {
  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function testSequenceTracks(data: SanityTestData, indices: number[], sequence: number, object: Animation, frames: number[] | Uint32Array): void {
  const { globalSequenceId, interpolationType, values } = object;
  let start;

  if (globalSequenceId === -1) {
    start = data.model.sequences[sequence].interval[0];
  } else {
    start = 0;
  }

  const firstIndex = indices[0];
  const lastIndex = indices[indices.length - 1];
  const firstFrame = frames[firstIndex];

  // Missing the opening track for a specific sequence can cause bugged warping with negative interpolations.
  if (interpolationType !== InterpolationType.DontInterp && firstFrame !== start) {
    const firstValue = values[firstIndex];
    const lastValue = values[lastIndex];

    // If the first and last values are equal, even though there's warping, it won't do anything.
    if (!areValuesEqual(firstValue, lastValue)) {
      data.addSevere(`Missing opening track for ${getSequenceName(data, sequence, globalSequenceId)} at frame ${start} where it is needed`);
    }
  }

  // Check for consecutive tracks with the same values.
  if (indices.length > 2) {
    let a = values[indices[0]];
    let b = values[indices[1]];

    for (let i = 2, l = indices.length; i < l; i++) {
      const c = values[indices[i]];
      const index = indices[i - 1];
      const d = getValuesDiff(a, b, c);

      if (d === 0) {
        data.addUnused(`Track ${index} at frame ${frames[index]} has exactly the same value as tracks ${index - 1} and ${index + 1}`);
      } else if (d < EPSILON) {
        data.addUnused(`Track ${index} at frame ${frames[index]} has roughly the same value as tracks ${index - 1} and ${index + 1}`);
      }

      a = b;
      b = c;
    }
  }
}

export default function testTracks(data: SanityTestData, object: Animation | EventObject): void {
  let framesOrTracks;

  if (object instanceof Animation) {
    data.assertWarning(object.frames.length > 0, 'Zero tracks');

    framesOrTracks = object.frames;
  } else {
    data.assertError(object.tracks.length > 0, 'Zero tracks');

    framesOrTracks = object.tracks;
  }

  const globalSequenceId = object.globalSequenceId;
  const separated: number[][] = [];

  if (globalSequenceId === -1) {
    data.assertWarning(data.model.sequences.length > 0, 'This animation exists, but the model has no sequences');

    for (let i = 0, l = data.model.sequences.length; i < l; i++) {
      separated.push([]);
    }
  } else if (testReference(data, data.model.globalSequences, globalSequenceId, 'global sequence')) {
    separated[globalSequenceId] = [];
  } else {
    return;
  }

  seprateTracks(data, framesOrTracks, globalSequenceId, separated);

  // Since event objects work on the concept of notes, where a keyframe denotes emission, check just animation keyframe values.
  if (object instanceof Animation) {
    for (let i = 0, l = separated.length; i < l; i++) {
      const indices = separated[i];

      if (indices && indices.length > 1) {
        testSequenceTracks(data, indices, i, object, framesOrTracks);
      }
    }
  }
}
