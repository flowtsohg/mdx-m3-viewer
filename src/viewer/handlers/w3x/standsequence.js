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
  // This function is registered both with whenLoaded, and with on.
  // The former sends the object directly, while the latter passes an event object, so take care of this difference here.
  if (target.target) {
    target = target.target;
  }

  if (target.model.sequences) {
    let sequences = target.model.sequences;
    let standSequence = selectSequence('stand', sequences);

    if (standSequence) {
      target.setSequence(standSequence.index);
    }
  }
}

export default standSequence;
