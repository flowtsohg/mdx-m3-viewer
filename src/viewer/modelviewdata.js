/**
 *
 */
export default class ModelViewData {
  /**
   * @param {ModelView} modelView
   * @param {Scene} scene
   */
  constructor(modelView, scene) {
    /** @member {ModelView} */
    this.modelView = modelView;
    /** @member {Scene} */
    this.scene = scene;
    /** @member {number} */
    this.instances = 0;
    /** @member {Array<Bucket>} */
    this.buckets = [];
    /** @member {number} */
    this.usedBuckets = 0;
    /** @member {number} */
    this.particles = 0;
  }

  /**
   *
   */
  startFrame() {
    this.instances = 0;
    this.usedBuckets = 0;
    this.particles = 0;

    for (let bucket of this.buckets) {
      bucket.count = 0;
    }
  }

  /**
   * @param {ModelInstance} instance
   */
  renderInstance(instance) {
    let buckets = this.buckets;
    let i = (this.instances / this.modelView.model.batchSize) | 0;

    if (!buckets[i]) {
      buckets[i] = new this.modelView.model.handler.Bucket(this.modelView);
    }

    buckets[i].renderInstance(instance);

    this.instances += 1;
    this.usedBuckets = i + 1;
  }

  /**
   * @param {ModelInstance} instance
   */
  renderEmitters(instance) {

  }

  /**
   *
   */
  updateBuffers() {
    let buckets = this.buckets;

    for (let i = 0, l = this.usedBuckets; i < l; i++) {
      buckets[i].updateBuffers();
    }
  }

  /**
   *
   */
  updateEmitters() {

  }

  /**
   *
   */
  renderOpaque() {
    if (this.instances) {
      this.modelView.model.renderOpaque(this);
    }
  }

  /**
   *
   */
  renderTranslucent() {
    if (this.instances) {
      this.modelView.model.renderTranslucent(this);
    }
  }
}
