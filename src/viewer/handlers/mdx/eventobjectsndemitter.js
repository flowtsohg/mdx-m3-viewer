/**
 * An MDX sound emitter.
 */
export default class EventObjectSndEmitter {
  /**
   * @param {EventEmitter} modelObject
   */
  constructor(modelObject) {
    this.modelObject = modelObject;
    this.type = 'SND';
  }

  /**
   * @param {EventObjectEmitterView} emitterView
   */
  emit(emitterView) {
    if (this.modelObject.ok) {
      let viewer = this.modelObject.model.viewer;
      let scene = emitterView.instance.scene;

      // Is audio enabled both viewer-wide and in this scene?
      if (viewer.enableAudio && scene.audioEnabled) {
        let audioContext = scene.audioContext;
        let emitter = emitterView.emitter;
        let decodedBuffers = emitter.decodedBuffers;
        let panner = audioContext.createPanner();
        let source = audioContext.createBufferSource();

        // Panner settings.
        panner.setPosition(...emitterView.instance.nodes[emitter.objectId].worldLocation);
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

  /**
   *
   */
  update() {

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
   * @param {ModelView} modelView
   * @param {ShaderProgram} shader
   */
  render(modelView, shader) {

  }

  /**
   * Does nothing.
   * Defined to stay compatible with SharedEmitter.
   *
   * @param {ModelInstance} owner
   */
  clear(owner) {

  }
}
