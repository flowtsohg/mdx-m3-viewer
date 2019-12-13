import Emitter from './emitter';

/**
 * An emitted object.
 */
export default abstract class EmittedObject {
  emitter: Emitter;
  index: number = -1;
  health: number = 0;

  abstract bind(emitData?: any): void;
  abstract update(dt: number): void;

  constructor(emitter: Emitter) {
    this.emitter = emitter;
  }
}
