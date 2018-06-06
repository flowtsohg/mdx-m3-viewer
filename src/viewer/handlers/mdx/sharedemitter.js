/**
 * A shared emitter.
 * The base class of all MDX emitters.
 */
export default class SharedEmitter {
  /**
   * @param {MdxModelParticleEmitter} modelObject
   */
  constructor(modelObject) {
    this.modelObject = modelObject;
    this.active = [];
    this.inactive = [];
  }

  /**
   * Note: flag is used for ParticleEmitter2's head/tail selection.
   *
   * @param {*} emitterView
   * @param {boolean} flag
   * @return {*}
   */
  emitObject(emitterView, flag) {
    let inactive = this.inactive;
    let object;

    if (inactive.length) {
      object = inactive.pop();
    } else {
      object = this.createObject();
    }

    object.reset(emitterView, flag);

    this.active.push(object);

    return object;
  }

  /**
   *
   */
  update() {
    let active = this.active;
    let inactive = this.inactive;

    if (active.length > 0) {
      // First update all of the active particles
      for (let i = 0, l = active.length; i < l; i++) {
        active[i].update();
      }

      if (active[0].health <= 0) {
        // Reverse the array
        active.reverse();

        // All dead active particles will now be at the end of the array, so pop them
        let object = active[active.length - 1];
        while (object && object.health <= 0) {
          inactive.push(active.pop());

          // Need to recalculate the length each time
          object = active[active.length - 1];
        }

        // Reverse the array again
        active.reverse();
      }

      this.updateData();
    }
  }

  fill(emitterView, scene) {
    let emission = emitterView.currentEmission;

    if (emission >= 1) {
      for (let i = 0; i < emission; i++ , emitterView.currentEmission--) {
        this.emit(emitterView);
      }
    }
  }

  updateData() {

  }

  render(bucket, shader) {

  }
}
