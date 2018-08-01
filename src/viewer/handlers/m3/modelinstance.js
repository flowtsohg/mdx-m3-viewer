import TexturedModelInstance from '../../texturedmodelinstance';
import M3Skeleton from './skeleton';

/**
 * An M3 model instance.
 */
export default class M3ModelInstance extends TexturedModelInstance {
  /**
   * @extends {TexturedModelInstance}
   * @param {M3Model} model
   */
  constructor(model) {
    super(model);

    this.skeleton = null;
    this.teamColor = 0;
    this.vertexColor = new Uint8Array([255, 255, 255, 255]);
    this.sequence = -1;
    this.frame = 0;
    this.sequenceLoopMode = 0;

    this.forced = true;
  }

  /**
   *
   */
  load() {
    this.skeleton = new M3Skeleton(this);

    // This takes care of calling setSequence before the model is loaded.
    // In this case, this.sequence will be set, but nothing else is changed.
    // Now that the model is loaded, set it again to do the real work.
    if (this.sequence !== -1) {
      this.setSequence(this.sequence);
    }
  }

  /**
   *
   */
  updateTimers() {
    let sequenceId = this.sequence;

    if (sequenceId !== -1) {
      let sequence = this.model.sequences[sequenceId];
      let interval = sequence.interval;

      this.frame += this.model.viewer.frameTime;

      if (this.frame > interval[1]) {
        if ((this.sequenceLoopMode === 0 && !(sequence.flags & 0x1)) || this.sequenceLoopMode === 2) {
          this.frame = interval[0];
        } else {
          this.frame = interval[1];
        }

        this.emit('seqend', this);
      }
    }
  }

  /**
   *
   */
  updateAnimations() {
    if (this.forced || this.sequence !== -1) {
      this.forced = false;

      this.skeleton.update();
    }
  }

  /**
   * @param {number} id
   * @return {this}
   */
  setTeamColor(id) {
    this.teamColor = id;

    return this;
  }

  /**
   * @param {Uint8Array} color
   * @return {this}
   */
  setVertexColor(color) {
    this.vertexColor.set(color);

    return this;
  }

  /**
   * @param {number} id
   * @return {this}
   */
  setSequence(id) {
    this.sequence = id;
    this.frame = 0;

    if (this.model.ok) {
      let sequences = this.model.sequences.length;

      if (id < -1 || id > sequences - 1) {
        id = -1;

        this.sequence = id;
      }

      // Do a forced update, so non-animated data can be skipped in future updates
      this.forced = true;
    }

    return this;
  }

  /**
   * @param {number} mode
   * @return {this}
   */
  setSequenceLoopMode(mode) {
    this.sequenceLoopMode = mode;

    return this;
  }

  /**
   * @param {number} id
   * @return {?SkeletalNode}
   */
  getAttachment(id) {
    let attachment = this.model.attachments[id];

    if (attachment) {
      return this.skeleton.nodes[attachment.bone];
    }
  }
}
