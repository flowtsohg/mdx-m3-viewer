import Scene from '../../scene';
import EmittedObject from '../../emittedobject';
import EventObjectEmitterObject from './eventobjectemitterobject';
import MdxModelInstance from './modelinstance';
import EventObjectSndEmitter from './eventobjectsndemitter';

/**
 * An MDX spawned sound object.
 */
export default class EventObjectSnd extends EmittedObject {
  bind(): void {
    const emitter = <EventObjectSndEmitter>this.emitter;
    const instance = <MdxModelInstance>emitter.instance;
    const viewer = instance.model.viewer;
    const scene = <Scene>instance.scene;

    // Is audio enabled both viewer-wide and in this scene?
    if (viewer.audioEnabled && scene.audioEnabled) {
      const emitterObject = <EventObjectEmitterObject>emitter.emitterObject;
      const node = instance.nodes[emitterObject.index];
      const audioContext = <AudioContext>scene.audioContext;
      const decodedBuffers = emitterObject.decodedBuffers;
      const panner = audioContext.createPanner();
      const source = audioContext.createBufferSource();
      const location = node.worldLocation;

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

  update(_dt: number): void {

  }
}
