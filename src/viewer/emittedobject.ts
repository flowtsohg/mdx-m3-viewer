import Emitter from './emitter';

/**
 * An emitted object.
 */
export default abstract class EmittedObject {
  emitter: Emitter;
  index = -1;
  health = 0;

  abstract bind(emitData?: unknown): void;
  abstract update(dt: number): void;

  constructor(emitter: Emitter) {
    this.emitter = emitter;
  }
}
