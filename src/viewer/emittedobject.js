/**
 * An emitted object.
 */
export default class EmittedObject {
  /**
   * @param {Emitter} emitter
   */
  constructor(emitter) {
    /** @member {Emitter} */
    this.emitter = emitter;
    /** @member {number} */
    this.index = -1;
    /** @member {number} */
    this.health = 0;
  }

  /**
   *
   */
  bind() {

  }

  /**
   * @param {number} dt
   */
  update(dt) {

  }
}
