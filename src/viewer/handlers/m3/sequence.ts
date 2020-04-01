import M3ParserSequence from '../../../parsers/m3/sequence';
import M3ParserBoundingSphere from '../../../parsers/m3/boundingsphere';

/**
 * An M3 sequence.
 */
export default class M3Sequence {
  name: string;
  interval: Uint32Array;
  movementSpeed: number;
  frequency: number;
  boundingSphere: M3ParserBoundingSphere;
  flags: number;

  constructor(sequence: M3ParserSequence) {
    this.name = sequence.name.getAll().join('');
    this.interval = sequence.interval;
    this.movementSpeed = sequence.movementSpeed;
    this.frequency = sequence.frequency;
    this.boundingSphere = sequence.boundingSphere;
    this.flags = sequence.flags;
  }
}
