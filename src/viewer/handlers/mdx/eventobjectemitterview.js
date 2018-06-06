import {vec2} from 'gl-matrix';

// Heap allocations needed for this module.
let track = vec2.create();

/**
 * An event object emitter view.
 */
export default class EventObjectEmitterView {
  /**
   * @param {ModelInstance} instance
   * @param {EventObjectEmitter} emitter
   */
  constructor(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.lastTrack = new Uint16Array(2); // Support more than 256 keyframes per sequence, why not.
    this.currentEmission = 0;
  }

  /**
   *
   */
  reset() {
    this.lastTrack.fill(0);
  }

  /**
   *
   */
  update() {
    if (this.instance.allowParticleSpawn) {
      let emitter = this.emitter;
      let lastTrack = this.lastTrack;

      emitter.getValue(track, this.instance);

      if (track[0] === 1 && (track[0] !== lastTrack[0] || track[1] !== lastTrack[1])) {
        this.currentEmission += 1;
      }

      lastTrack[0] = track[0];
      lastTrack[1] = track[1];
    }
  }
}
