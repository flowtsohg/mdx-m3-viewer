import EmittedObject from '../../emittedobject';

/**
 * An MDX spawned model object.
 */
export default class EventObjectSpn extends EmittedObject {
  /**
   * @param {EventObjectSpnEmitter} emitter
   */
  constructor(emitter) {
    super(emitter);

    this.internalInstance = emitter.emitterObject.internalModel.addInstance();
  }

  /**
   * @override
   */
  bind() {
    let emitter = this.emitter;
    let instance = this.internalInstance;
    let node = emitter.instance.nodes[emitter.emitterObject.index];

    instance.setSequence(0);
    instance.setTransformation(node.worldLocation, node.worldRotation, node.worldScale);
    instance.show();

    emitter.instance.scene.addInstance(instance);

    this.health = 1;
  }

  /**
   * @override
   * @param {number} dt
   */
  update(dt) {
    let instance = this.internalInstance;

    // Once the sequence finishes, this event object dies
    if (instance.frame >= instance.model.sequences[0].interval[1]) {
      this.health = 0;

      instance.hide();
    }
  }
}
