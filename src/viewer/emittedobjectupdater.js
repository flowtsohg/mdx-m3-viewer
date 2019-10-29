/**
 * An emitted object updater.
 */
export default class EmittedObjectUpdater {
  /**
   *
   */
  constructor() {
    /** @member {Array<EmittedObject>} */
    this.objects = [];
    /** @member {number} */
    this.alive = 0;
  }

  /**
   * @param {EmittedObject} object
   */
  add(object) {
    this.objects[this.alive++] = object;
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    // Update all of the objects.
    let objects = this.objects;

    for (let i = 0; i < this.alive; i++) {
      let object = objects[i];

      object.update(dt);

      if (object.health <= 0) {
        this.alive -= 1;

        object.emitter.kill(object);

        // Swap between this object and the last living object.
        // Decrement the iterator so the swapped object is updated this frame.
        if (i !== this.alive) {
          objects[i] = objects[this.alive];
          i -= 1;
        }
      }
    }
  }
}
