import {testSphere} from '../common/gl-matrix-addon';
import {EventNode} from './node';

/**
 * A model instance.
 */
export default class ModelInstance extends EventNode {
  /**
   * @param {Model} model
   */
  constructor(model) {
    super();

    /** @member {?Scene} */
    this.scene = null;
    /** @member {number} */
    this.left = -1;
    /** @member {number} */
    this.right = -1;
    /** @member {number} */
    this.bottom = -1;
    /** @member {number} */
    this.top = -1;
    /** @member {number} */
    this.plane = -1;
    /** @member {number} */
    this.updateFrame = 0;
    /** @member {number} */
    this.renderFrame = 0;
    /** @member {Model} */
    this.model = model;
    /** @member {?ModelView} */
    this.modelView = null;
    /** @member {?ModelViewData} */
    this.modelViewData = null;

    /**
     * Decides whether the instance is updated or not.
     *
     * @member {boolean}
     */
    this.paused = false;
    /**
     * Decides whether the instance is rendered or not.
     *
     * @member {boolean}
     */
    this.rendered = true;
  }

  /**
   * This instance should be shown.
   */
  show() {
    this.rendered = true;
  }

  /**
   * This instance should be hidden.
   */
  hide() {
    this.rendered = false;
  }

  /**
   * Should the instance be shown?
   *
   * @return {boolean}
   */
  shown() {
    return this.rendered;
  }

  /**
   * Should the instance be hidden?
   *
   * @return {boolean}
   */
  hidden() {
    return !this.rendered;
  }

  /**
   * Detach this instance from the scene it's in.
   * Equivalent to scene.removeInstance(instance).
   *
   * @return {boolean}
   */
  detach() {
    if (this.scene) {
      return this.scene.removeInstance(this);
    }

    return false;
  }

  /**
   * Called once the model is loaded, or immediately if the model was already loaded.
   */
  load() {

  }

  /**
   * Called every frame.
   * Do lightweight updates here, like updating animation timers.
   */
  updateTimers() {

  }

  /**
   * Called if the instance is shown and not culled.
   * Do heavyweight updates here, like updating skeletons.
   */
  updateAnimations() {

  }

  /**
   * Clears any objects that were emitted by this instance.
   */
  clearEmittedObjects() {

  }

  /**
   * Update this model instance.
   * Called automatically by the scene that owns this model instance.
   *
   * @param {Scene} scene
   */
  updateObject(scene) {
    if (this.rendered && this.updateFrame < this.model.viewer.frame) {
      if (!this.paused) {
        this.updateTimers();
        this.updateAnimations();
      }

      this.updateFrame = this.model.viewer.frame;
    }
  }

  /**
   * Sets the scene of this instance.
   * This is equivalent to scene.addInstance(instance).
   *
   * @param {Scene} scene
   * @return {boolean}
   */
  setScene(scene) {
    return scene.addInstance(this);
  }

  /**
   * @override
   */
  recalculateTransformation() {
    super.recalculateTransformation();

    if (this.scene) {
      this.scene.grid.moved(this);
    }
  }

  /**
   *
   */
  render() {
    if (this.rendered && this.renderFrame < this.model.viewer.frame) {
      let modelViewData = this.modelViewData;

      modelViewData.renderInstance(this);
      modelViewData.renderEmitters(this);

      this.renderFrame = this.model.viewer.frame;
    }
  }

  /**
   * @param {Camera} camera
   * @return {boolean}
   */
  isVisible(camera) {
    let location = this.worldLocation;
    let bounds = this.model.bounds;

    this.plane = testSphere(camera.planes, location[0] + bounds.x, location[1] + bounds.y, location[2], bounds.r, this.plane);

    return this.plane === -1;
  }
}
