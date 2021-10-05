import EmittedObject from './emittedobject';

/**
 * An emitted object updater.
 */
export default class EmittedObjectUpdater {
  objects: EmittedObject[] = [];
  alive = 0;

  add(object: EmittedObject): void {
    this.objects[this.alive++] = object;
  }

  update(dt: number): void {
    const objects = this.objects;

    for (let i = 0; i < this.alive; i++) {
      const object = objects[i];

      object.update(dt * object.emitter.instance.timeScale);

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
