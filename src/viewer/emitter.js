/**
 * An emitter.
 */
export default class Emitter {
  /**
   * @param {ModelInstance} instance
   * @param {?} emitterObject
   */
  constructor(instance, emitterObject) {
    /** @member {ModelInstance} */
    this.instance = instance;
    /** @member {?} */
    this.emitterObject = emitterObject;
    /** @member {Array<EmittedObject>} */
    this.objects = [];
    /** @member {number} */
    this.alive = 0;
    /** @member {number} */
    this.currentEmission = 0;
  }

  /**
   * @param {number} flags
   * @return {EmittedObject}
   */
  emitObject(flags) {
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

  /**
   * @param {number} dt
   */
  update(dt) {
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
   * @param {EmittedObject} object
   */
  kill(object) {
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

      object.index = -1;
      object.health = 0;
    }

    this.alive = 0;
    this.currentEmission = 0;
  }
}
