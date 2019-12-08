import ModelInstance from './modelinstance';
import EmittedObject from './emittedobject';

/**
 * An emitter.
 */
export default abstract class Emitter {
  instance: ModelInstance;
  emitterObject: any;
  objects: EmittedObject[];
  alive: number;
  currentEmission: number;

  abstract createObject(): EmittedObject;
  abstract updateEmission(dt: number): void;
  abstract emit(): void;

  constructor(instance: ModelInstance, emitterObject: any) {
    this.instance = instance;
    this.emitterObject = emitterObject;
    this.objects = [];
    this.alive = 0;
    this.currentEmission = 0;
  }

  emitObject(flags?: any) {
    let objects = this.objects;

    // If there are no unused objects, create a new one.
    if (this.alive === objects.length) {
      objects.push(this.createObject());
    }

    // Get the first unused object.
    let object = objects[this.alive];

    object.index = this.alive;

    object.bind(flags);

    this.alive += 1;
    this.currentEmission -= 1;

    this.instance.scene.emittedObjectUpdater.add(object);

    return object;
  }

  update(dt: number) {
    // Emit new objects if needed.
    this.updateEmission(dt);

    let currentEmission = this.currentEmission;

    if (currentEmission >= 1) {
      for (let i = 0; i < currentEmission; i += 1) {
        this.emit();
      }
    }
  }

  kill(object: EmittedObject) {
    let objects = this.objects;

    this.alive -= 1;

    let otherObject = objects[this.alive];

    objects[object.index] = otherObject;
    objects[this.alive] = object;

    otherObject.index = object.index;
    object.index = -1;
  }

  /**
   * Clear any emitted objects.
   */
  clear() {
    let objects = this.objects;

    for (let i = 0, l = this.alive; i < l; i++) {
      let object = objects[i];

      object.health = 0;
    }

    this.currentEmission = 0;
  }
}
