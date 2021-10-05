import Scene from './scene';
import ModelInstance from './modelinstance';
import EmittedObject from './emittedobject';

/**
 * An emitter.
 */
export default abstract class Emitter {
  instance: ModelInstance;
  objects: EmittedObject[] = [];
  alive = 0;
  currentEmission = 0;

  abstract createObject(): EmittedObject;
  abstract updateEmission(dt: number): void;
  abstract emit(): void;

  constructor(instance: ModelInstance) {
    this.instance = instance;
  }

  /**
   * Update this emitter.
   */
  update(dt: number): void {
    // Emit new objects if needed.
    this.updateEmission(dt);

    const currentEmission = this.currentEmission;

    if (currentEmission >= 1) {
      for (let i = 0; i < currentEmission; i += 1) {
        this.emit();
      }
    }
  }

  /**
   * Clear any emitted objects.
   */
  clear(): void {
    const objects = this.objects;

    for (let i = 0, l = this.alive; i < l; i++) {
      const object = objects[i];

      object.health = 0;
    }

    this.currentEmission = 0;
  }

  emitObject(emitData?: unknown): EmittedObject {
    const objects = this.objects;

    // If there are no unused objects, create a new one.
    if (this.alive === objects.length) {
      objects.push(this.createObject());
    }

    // Get the first unused object.
    const object = objects[this.alive];

    object.index = this.alive;

    object.bind(emitData);

    this.alive += 1;
    this.currentEmission -= 1;

    const scene = <Scene>this.instance.scene;

    scene.emittedObjectUpdater.add(object);

    return object;
  }

  kill(object: EmittedObject): void {
    const objects = this.objects;

    this.alive -= 1;

    const otherObject = objects[this.alive];

    objects[object.index] = otherObject;
    objects[this.alive] = object;

    otherObject.index = object.index;
    object.index = -1;
  }
}
