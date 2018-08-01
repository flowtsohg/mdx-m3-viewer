/**
 * A shared emitter.
 * The base class of all MDX emitters.
 */
export default class SharedEmitter {
  /**
   * @param {ParticleEmitter|ParticleEmitter2|RibbonEmitter|EventObject} modelObject
   */
  constructor(modelObject) {
    /** @member {ParticleEmitter|ParticleEmitter2|RibbonEmitter|EventObject} */
    this.modelObject = modelObject;
    /** @member {Array<Particle|Particle2|Ribbon|EventObjectSpn|EventObjectSpl|EventObjectUbr>} */
    this.objects = [];
    /** @member {number} */
    this.alive = 0;
  }

  /**
   * Note: flag is used for ParticleEmitter2's head/tail selection.
   *
   * @param {ParticleEmitterView|ParticleEmitter2View|RibbonEmitterView|EventObjectEmitterView} emitterView
   * @param {boolean} flag
   * @return {Particle|Particle2|Ribbon|EventObjectSpn|EventObjectSpl|EventObjectUbr}
   */
  emitObject(emitterView, flag) {
    let objects = this.objects;

    // If there are no unused objects, create a new one.
    if (this.alive === objects.length) {
      objects.push(this.createObject());
    }

    // Get the first unused object.
    let object = objects[this.alive];

    this.alive += 1;

    object.reset(emitterView, flag);

    return object;
  }

  /**
   *
   */
  update() {
    let objects = this.objects;

    for (let i = 0; i < this.alive; i++) {
      let object = objects[i];

      object.update();

      if (object.health <= 0) {
        this.alive -= 1;

        // Swap between this object and the first unused object.
        // Decrement the iterator so the moved object is indexed.
        if (i !== this.alive) {
          objects[i] = objects[this.alive];
          objects[this.alive] = object;
          i -= 1;
        }
      }
    }

    this.updateData();
  }

  /**
   * @param {ParticleEmitterView|ParticleEmitter2View|RibbonEmitterView|EventObjectEmitterView} emitterView
   */
  fill(emitterView) {
    let emission = emitterView.currentEmission;

    if (emission >= 1) {
      for (let i = 0; i < emission; i += 1, emitterView.currentEmission--) {
        this.emit(emitterView);
      }
    }
  }

  /**
   *
   */
  updateData() {

  }

  /**
   * @param {ModelView} modelView
   * @param {ShaderProgram} shader
   */
  render(modelView, shader) {

  }

  /**
   * Clear any emitted objects belonging to the given owner.
   *
   * @param {ModelInstance} owner
   */
  clear(owner) {
    for (let object of this.objects) {
      if (owner === object.emitterView.instance) {
        object.health = 0;
      }
    }
  }
}
