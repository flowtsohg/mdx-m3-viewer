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
    if (viewer.enableAudio && scene.audioEnabled) {
      let emitterObject = <EventObjectEmitterObject>emitter.emitterObject;
      let node = instance.nodes[emitterObject.index];
      let audioContext = <AudioContext>scene.audioContext;
      let decodedBuffers = emitterObject.decodedBuffers;
      let panner = audioContext.createPanner();
      let source = audioContext.createBufferSource();
      let location = node.worldLocation;

      // Panner settings.
      panner.setPosition(location[0], location[1], location[2]);
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
