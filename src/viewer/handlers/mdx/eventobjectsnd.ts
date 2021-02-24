import Scene from '../../scene';
import EmittedObject from '../../emittedobject';
import EventObjectEmitterObject from './eventobjectemitterobject';
import MdxModelInstance from './modelinstance';
import EventObjectSndEmitter from './eventobjectsndemitter';

/**
 * An MDX spawned sound object.
 */
export default class EventObjectSnd extends EmittedObject {
  bind() {
    let emitter = <EventObjectSndEmitter>this.emitter;
    let instance = <MdxModelInstance>emitter.instance;
    let viewer = instance.model.viewer;
    let scene = <Scene>instance.scene;

    // Is audio enabled both viewer-wide and in this scene?
    if (viewer.audioEnabled && scene.audioEnabled) {
      let emitterObject = <EventObjectEmitterObject>emitter.emitterObject;
      let node = instance.nodes[emitterObject.index];
      let audioContext = <AudioContext>scene.audioContext;
      let decodedBuffers = emitterObject.decodedBuffers;
      let panner = audioContext.createPanner();
      let source = audioContext.createBufferSource();
      let location = node.worldLocation;

      // Panner settings.
      panner.positionX.value = location[0];
      panner.positionY.value = location[1];
      panner.positionZ.value = location[2];
      panner.maxDistance = emitterObject.distanceCutoff;
      panner.refDistance = emitterObject.minDistance;
      panner.connect(audioContext.destination);

      // Source.
      source.buffer = decodedBuffers[(Math.random() * decodedBuffers.length) | 0];
      source.connect(panner);

      // Make a sound.
      source.start(0);
    }
  }

  update(dt: number) {

  }
}
