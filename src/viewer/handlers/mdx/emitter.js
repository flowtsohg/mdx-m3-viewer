/**
 * An emitter.
 * The base class of all MDX emitters.
 */
export default class Emitter {
  /**
   * @param {ModelViewData} modelViewData
   * @param {ParticleEmitter|ParticleEmitter2|RibbonEmitter|EventObject} modelObject
   */
  constructor(modelViewData, modelObject) {
    /** @member {ModelViewData} */
    this.modelViewData = modelViewData;
    /** @member {ParticleEmitter|ParticleEmitter2|RibbonEmitter|EventObject} */
    this.modelObject = modelObject;
    /** @member {Array<Particle|Particle2|Ribbon|EventObjectSpn|EventObjectSpl|EventObjectUbr>} */
    this.objects = [];
    /** @member {number} */
    this.alive = 0;
  }

  /**
   * Note: tail is used for ParticleEmitter2's head/tail selection.
   *
   * @param {ParticleEmitterView|ParticleEmitter2View|RibbonEmitterView|EventObjectEmitterView} emitterView
   * @param {number} tail
   * @return {Particle|Particle2|Ribbon|EventObjectSpn|EventObjectSpl|EventObjectUbr}
   */
  emitObject(emitterView, tail) {
    let objects = this.objects;

    // If there are no unused objects, create a new one.
    if (this.alive === objects.length) {
      objects.push(this.createObject());
    }

    // Get the first unused object.
    let object = objects[this.alive];

    this.alive += 1;

    object.bind(emitterView, tail);

    return object;
  }

  /**
   *
   */
  update() {
    let dt = this.modelObject.model.viewer.frameTime * 0.001;
    let objects = this.objects;
    let offset = 0;

    for (let i = 0; i < this.alive; i++) {
      let object = objects[i];

      object.render(offset, dt);

      if (object.health > 0) {
        offset += 1;
      } else {
        this.alive -= 1;

        // Swap between this object and the last living object.
        // Decrement the iterator so the swapped object is updated this frame.
        if (i !== this.alive) {
          objects[i] = objects[this.alive];
          objects[this.alive] = object;
          i -= 1;
        }
      }
    }
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
