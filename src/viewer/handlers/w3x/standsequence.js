function sequenceSorter(a, b) {
  return a.sequence.rarity < b.sequence.rarity;
}

function filterSequences(type, sequences) {
  let filtered = [];

  for (let i = 0, l = sequences.length; i < l; i++) {
    let sequence = sequences[i],
      name = sequence.name.split('-')[0].replace(/\d/g, '').trim().toLowerCase();

    if (name === type) {
      filtered.push({sequence, index: i});
    }
  }

  return filtered;
}

function selectSequence(type, sequences) {
  sequences = filterSequences(type, sequences);

  sequences.sort(sequenceSorter);

  for (var i = 0, l = sequences.length; i < l; i++) {
    var sequence = sequences[i].sequence;
    let rarity = sequence.rarity;

    if (rarity === 0) {
      break;
    }

    if (Math.random() * 10 > rarity) {
      return sequences[i];
    }
  }

  let sequencesLeft = sequences.length - i;
  let random = i + Math.floor(Math.random() * sequencesLeft);
  var sequence = sequences[random];

  return sequence;
}

function standSequence(target) {
  let sequences = target.model.sequences;
  let sequence = selectSequence('stand', sequences);

  if (sequence) {
    target.setSequence(sequence.index);
  }
};

export default function standOnRepeat(target) {
  target.model.whenLoaded()
    .then((model) => {
      standSequence(target);
      target.on('seqend', standSequence);
    });
};
