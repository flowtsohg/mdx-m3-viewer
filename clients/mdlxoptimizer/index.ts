import { extname } from "../../src/common/path";
// @ts-ignore
import { getAllFileEntries, readEntry } from "../shared/utils";
import MdlxModel from '../../src/parsers/mdlx/model';
import AnimatedObject from '../../src/parsers/mdlx/animatedobject';
import { Animation } from '../../src/parsers/mdlx/animations';
import { getValuesDiff } from '../../src/utils/mdlx/sanitytest/tracks';

type Value = Uint32Array | Float32Array;

type Entry = [number, Value, Value, Value];
const FRAME = 0;
const VALUE = 1;
const INTAN = 2;
const OUTTAN = 3;

function optimizeAnimation(model: MdlxModel, animation: Animation) {
  const sequences = model.sequences;
  const { interpolationType, globalSequenceId, frames, values, inTans, outTans } = animation;

  if (globalSequenceId !== -1) {
    console.error('NEED TO ADD GLOBAL ANIMATION SUPPORT');
    return 0;
  }
  
  // Map the keyframes to entries, and remove duplicated frames while we're at it.
  const entryMap = new Map<number, Entry>();

  for (let i = 0, l = frames.length; i < l; i++) {
    entryMap.set(frames[i], [frames[i], values[i], inTans[i], outTans[i]])
  }

  // Now back to an array.
  const entries: Entry[] = [...entryMap.values()];

  // And sort it.
  entries.sort((a, b) => a[FRAME] - b[FRAME]);

  // Get all of the edge entries.
  // In other words, the frames of the current first and last entries for every sequence.
  const edges = new Set<number>();

  for (const sequence of sequences) {
    const [start, end] = sequence.interval;
    let startFrame = Infinity;
    let endFrame = Infinity;

    for (const entry of entries) {
      const frame = entry[FRAME];

      if (startFrame === Infinity && frame - start >= 0) {
        startFrame = frame;
      }

      if (end - frame >= 0) {
        endFrame = frame;
      }
    }

    edges.add(startFrame);
    edges.add(endFrame);
  }

  const keptEntries: Entry[] = [];

  // Now we can iterate over the entries.
  for (let i = 0, l = entries.length; i < l; i++) {
    const entry = entries[i];
    const frame = entry[FRAME];

    // Edge entries are left as-is.
    if (edges.has(frame)) {
      keptEntries.push(entry);
    } else {
      // Otherwise, let's see if this entry is in any sequence to begin with.
      for (const sequence of sequences) {
        const [start, end] = sequence.interval;

        if (frame >= start && frame <= end) {
          keptEntries.push(entry);
          break;
        }
      }
    }
  }

  const finalEntries: Entry[] = [];

  // Now that all of the entries are valid in sequences, we can check for values.
  if (keptEntries.length >= 2) {
    for (let i = 0, l = keptEntries.length; i < l; i++) {
      const entry = keptEntries[i];
      const frame = entry[FRAME];

      // Once again, don't touch edges.
      if (edges.has(frame)) {
        finalEntries.push(entry);

        continue;
      }

      // Otherwise, if this isn't the first or last entries, check for equal values.
      if (i > 0 && i < keptEntries.length - 1) {
        const prevEntry = keptEntries[i - 1];
        const nextEntry = keptEntries[i + 1];
        const difference = getValuesDiff(prevEntry[VALUE], entry[VALUE], nextEntry[VALUE]);

        if (difference > 0.0001) {
          finalEntries.push(entry);
        }
      }
    }
  }

  const newFrames = [];
  const newValues = [];
  const newInTans = [];
  const newOutTans = [];

  for (const entry of finalEntries) {
    newFrames.push(entry[FRAME]);
    newValues.push(entry[VALUE]);

    if (interpolationType > 1) {
      newInTans.push(entry[INTAN]);
      newOutTans.push(entry[OUTTAN]);
    }
  }

  animation.frames = newFrames;
  animation.values = newValues;
  animation.inTans = newInTans;
  animation.outTans = newOutTans;

  return frames.length - newFrames.length;
}

function optimizeAnimations(model: MdlxModel, animations: Animation[]) {
  let tracks = 0;
  
  for (const animation of animations) {
    tracks += optimizeAnimation(model, animation);
  }

  return tracks;
}

function optimizeMaterials(model: MdlxModel) {
  let tracks = 0;

  for (const material of model.materials) {
    for (const layer of material.layers) {
      tracks += optimizeAnimations(model, layer.animations)
    }
  }

  return tracks;
}

function optimizeObjects(model: MdlxModel, objects: AnimatedObject[]) {
  let tracks = 0;

  for (const object of objects) {
    tracks += optimizeAnimations(model, object.animations);
  }

  return tracks;
}

function optimizeModel(name: string, buffer: ArrayBuffer) {
  try {
    const model = new MdlxModel();

    model.load(buffer);

    let tracks = 0;

    tracks += optimizeMaterials(model);
    tracks += optimizeObjects(model, model.textureAnimations);
    tracks += optimizeObjects(model, model.geosetAnimations);
    tracks += optimizeObjects(model, model.bones);
    tracks += optimizeObjects(model, model.lights);
    tracks += optimizeObjects(model, model.helpers);
    tracks += optimizeObjects(model, model.attachments);
    tracks += optimizeObjects(model, model.particleEmitters);
    tracks += optimizeObjects(model, model.particleEmitters2);
    tracks += optimizeObjects(model, model.particleEmittersPopcorn);
    tracks += optimizeObjects(model, model.ribbonEmitters);
    tracks += optimizeObjects(model, model.cameras);
    tracks += optimizeObjects(model, model.collisionShapes);

    console.log(`Removed ${tracks} tracks`);

    return model.saveMdx();
  } catch (e) {
    console.error(`Error for "${name}": ${e}`);

    return undefined;
  }
}

async function optimizeDataTransfer(dataTransfer: DataTransfer) {
  const entries = await getAllFileEntries(dataTransfer);
  const names = [];
  const promises = [];

  for (let entry of entries) {
    const name = entry.name;
    const ext = extname(name);

    if (ext === '.mdx' || ext === '.mdl') {
      names.push(name);
      promises.push(readEntry(entry, ext === '.mdl'));
    }
  }

  const buffers = await Promise.all(promises);
  const optimizedBuffers = [];

  for (let i = 0, l = buffers.length; i < l; i++) {
    optimizedBuffers.push(optimizeModel(names[i], buffers[i]));
  }

  for (let i = 0, l = buffers.length; i < l; i++) {
    const buffer = optimizedBuffers[i];

    if (buffer) {
      // @ts-ignore
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'opt_' + names[i]);
    }
  }
}

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  if (e.dataTransfer) {
    optimizeDataTransfer(e.dataTransfer);
  }
});
