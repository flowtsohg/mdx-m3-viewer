/**
 * An M3 sequence.
 */
export default class M3Sequence {
  /**
   * @param {M3ParserSequence} sequence
   */
  constructor(sequence) {
    this.name = sequence.name.getAll().join('');
    this.interval = sequence.interval;
    this.movementSpeed = sequence.movementSpeed;
    this.frequency = sequence.frequency;
    this.boundingSphere = sequence.boundingSphere;
  }
}
