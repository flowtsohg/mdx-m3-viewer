import MdlxSequence from '../../../parsers/mdlx/sequence';
import Bounds from '../../bounds';

/**
 * An MDX sequence.
 */
export default class Sequence {
  name: string;
  interval: Uint32Array;
  nonLooping: number;
  rarity: number;
  bounds: Bounds;

  constructor(sequence: MdlxSequence) {
    this.name = sequence.name;
    this.interval = sequence.interval;
    this.nonLooping = sequence.nonLooping;
    this.rarity = sequence.rarity;
    this.bounds = new Bounds();

    const extent = sequence.extent;
    this.bounds.fromExtents(extent.min, extent.max);
  }
}
