import EmittedObject from '../../emittedobject';

/**
 * An MDX spawned sound object.
 */
export default class EventObjectSnd extends EmittedObject {
  /**
   * @override
   */
  bind() {
    let emitter = this.emitter;
    let instance = emitter.instance;
    let emitterObject = emitter.emitterObject;
    let node = instance.nodes[emitter.emitterObject.index];

    if (emitterObject.ok) {
      let viewer = instance.model.viewer;
      let scene = instance.scene;

      // Is audio enabled both viewer-wide and in this scene?
      if (viewer.enableAudio && scene.audioEnabled) {
        let audioContext = scene.audioContext;
        let decodedBuffers = emitter.decodedBuffers;
        let panner = audioContext.createPanner();
        let source = audioContext.createBufferSource();

        // Panner settings.
        panner.setPosition(...node.worldLocation);
        panner.maxDistance = emitter.distanceCutoff;
        panner.refDistance = emitter.minDistance;
        panner.connect(audioContext.destination);

        // Source.
        source.buffer = decodedBuffers[(Math.random() * decodedBuffers.length) | 0];
        source.connect(panner);

        // Make a sound.
        source.start(0);
      }
    }
  }
}
