import Emitter from './emitter';

/**
 * An emitted object.
 */
export default class EmittedObject {
  emitter: Emitter;
  index: number;
  health: number;

  constructor(emitter: Emitter) {
    this.emitter = emitter;
    this.index = -1;
    this.health = 0;
  }

  bind(emitData?: any) {

  }

  update(dt: number) {

  }
}
