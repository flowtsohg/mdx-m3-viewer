function sequenceSorter(a, b) {
    return a.sequence.rarity < b.sequence.rarity;
}

function filterSequences(type, sequences) {
    var filtered = [];

    for (var i = 0, l = sequences.length; i < l; i++) {
        var sequence = sequences[i],
            name = sequence.name.split('-')[0].replace(/\d/g, '').trim().toLowerCase();

        if (name === type) {
            filtered.push({ sequence, index: i });
        }
    }

    return filtered;
}

function selectSequence(type, sequences) {
    sequences = filterSequences(type, sequences);

    sequences.sort(sequenceSorter);

    for (var i = 0, l = sequences.length; i < l; i++) {
        var sequence = sequences[i].sequence;
        var rarity = sequence.rarity;

        if (rarity === 0) {
            break;
        }

        if (Math.random() * 10 > rarity) {
            return sequences[i];
        }
    }

    var sequencesLeft = sequences.length - i;
    var random = i + Math.floor(Math.random() * sequencesLeft);
    var sequence = sequences[random]

    return sequence;
}

function standSequence(target) {
    // This function is registered both with whenLoaded, and with addEventListener.
    // The former sends the object directly, while the latter passes an event object, so take care of this difference here.
    if (target.target) {
        target = target.target;
    }

    if (target.model.sequences) {
        var sequences = target.model.sequences;
        var standSequence = selectSequence('stand', sequences);

        if (standSequence) {
            target.setSequence(standSequence.index);
        }
    }
}

export default standSequence;
