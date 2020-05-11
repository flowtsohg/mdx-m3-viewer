import Sequence from '../../../parsers/mdlx/sequence';
import MdxModel from '../mdx/model';
import MdxModelInstance from '../mdx/modelinstance';

interface FilteredSequence {
  sequence: Sequence;
  index: number;
}

function sequenceSorter(a: FilteredSequence, b: FilteredSequence) {
  return a.sequence.rarity - b.sequence.rarity;
}

function filterSequences(type: string, sequences: Sequence[]) {
  let filtered = [];

  for (let i = 0, l = sequences.length; i < l; i++) {
    let sequence = sequences[i],
      name = sequence.name.split('-')[0].replace(/\d/g, '').trim().toLowerCase();

    if (name === type) {
      filtered.push({ sequence, index: i });
    }
  }

  return filtered;
}

function selectSequence(type: string, sequences: Sequence[]) {
  let filtered = filterSequences(type, sequences);

  filtered.sort(sequenceSorter);

  for (var i = 0, l = filtered.length; i < l; i++) {
    let sequence = filtered[i].sequence;
    let rarity = sequence.rarity;

    if (rarity === 0) {
      break;
    }

    if (Math.random() * 10 > rarity) {
      return filtered[i];
    }
  }

  let sequencesLeft = filtered.length - i;
  let random = i + Math.floor(Math.random() * sequencesLeft);
  let sequence = filtered[random];

  return sequence;
}

export default function randomStandSequence(target: MdxModelInstance) {
  let model = <MdxModel>target.model;
  let sequences = model.sequences;
  let sequence = selectSequence('stand', sequences);

  if (sequence) {
    target.setSequence(sequence.index);
  }
}
