import EmittedObject from '../../emittedobject';
import MdxModel from './model';
import EventObjectEmitterObject from './eventobjectemitterobject';
import MdxComplexInstance from './complexinstance';
import EventObjectSpnEmitter from './eventobjectspnemitter';

/**
 * An MDX spawned model object.
 */
export default class EventObjectSpn extends EmittedObject {
  internalInstance: MdxComplexInstance;

  constructor(emitter: EventObjectSpnEmitter) {
    super(emitter);

    let emitterObject = <EventObjectEmitterObject>emitter.emitterObject;
    let internalModel = <MdxModel>emitterObject.internalModel;

    this.internalInstance = <MdxComplexInstance>internalModel.addInstance();
  }

  bind() {
    let emitter = <EventObjectSpnEmitter>this.emitter;
    let instance = <MdxComplexInstance>emitter.instance;
    let node = instance.nodes[emitter.emitterObject.index];
    let internalInstance = <MdxComplexInstance>this.internalInstance;

    internalInstance.setSequence(0);
    internalInstance.setTransformation(node.worldLocation, node.worldRotation, node.worldScale);
    internalInstance.show();

    instance.scene.addInstance(internalInstance);

    this.health = 1;
  }

  update(dt: number) {
    let instance = this.internalInstance;
    let model = <MdxModel>instance.model;

    // Once the sequence finishes, this event object dies
    if (instance.frame >= model.sequences[0].interval[1]) {
      this.health = 0;

      instance.hide();
    }
  }
}
