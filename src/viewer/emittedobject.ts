import Emitter from './emitter';

/**
 * An emitted object.
 */
export default abstract class EmittedObject {
  emitter: Emitter;
  index: number;
  health: number;

  abstract bind(emitData?: any): void;
  abstract update(dt: number): void;

  constructor(emitter: Emitter) {
    this.emitter = emitter;
    this.index = -1;
    this.health = 0;
  }
}
