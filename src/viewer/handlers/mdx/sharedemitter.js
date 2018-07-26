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

    this.objects = [];
    this.alive = 0;

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
   * @param {*} emitterView
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
}
