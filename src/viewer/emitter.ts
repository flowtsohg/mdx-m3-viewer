import Scene from './scene';
import ModelInstance from './modelinstance';
import EmittedObject from './emittedobject';

/**
 * An emitter.
 */
export default abstract class Emitter {
  instance: ModelInstance;
  objects: EmittedObject[] = [];
  alive: number = 0;
  currentEmission: number = 0;

  abstract createObject(): EmittedObject;
  abstract updateEmission(dt: number): void;
  abstract emit(): void;

  constructor(instance: ModelInstance) {
    this.instance = instance;
  }

  /**
   * Update this emitter.
   */
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

  emitObject(emitData?: any) {
    let objects = this.objects;

    // If there are no unused objects, create a new one.
    if (this.alive === objects.length) {
      objects.push(this.createObject());
    }

    // Get the first unused object.
    let object = objects[this.alive];

    object.index = this.alive;

    object.bind(emitData);

    this.alive += 1;
    this.currentEmission -= 1;

    let scene = <Scene>this.instance.scene;

    scene.emittedObjectUpdater.add(object);

    return object;
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
}
