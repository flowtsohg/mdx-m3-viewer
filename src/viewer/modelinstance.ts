import { testSphere, distanceToPlane3 } from '../common/gl-matrix-addon';
import { Node } from './node';
import Model from './model';
import Scene from './scene';
import Camera from './camera';
import Texture from './texture';

/**
 * A model instance.
 */
export default abstract class ModelInstance extends Node {
  scene: Scene | null = null;
  left: number = -1;
  right: number = -1;
  bottom: number = -1;
  top: number = -1;
  plane: number = -1;
  depth: number = 0;
  updateFrame: number = 0;
  cullFrame: number = 0;
  model: Model;
  /**
   * If true, this instance won't be updated.
   */
  paused: boolean = false;
  /**
   * If false, this instance won't be rendered.
   * 
   * When working with Warcraft 3 instances, it is preferable to use hide() and show().
   * These hide and show also internal instances of this instance.
   */
  rendered: boolean = true;
  textureOverrides: Map<number, Texture> = new Map();

  constructor(model: Model) {
    super();

    this.model = model;
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
   */
  shown() {
    return this.rendered;
  }

  /**
   * Should the instance be hidden?
   */
  hidden() {
    return !this.rendered;
  }

  /**
   * Detach this instance from the scene it's in.
   * 
   * Equivalent to scene.removeInstance(instance).
   */
  detach() {
    if (this.scene) {
      return this.scene.removeInstance(this);
    }

    return false;
  }

  overrideTexture(index: number, texture?: Texture) {
    if (texture) {
      this.textureOverrides.set(index, texture);
    } else {
      this.textureOverrides.delete(index);
    }
  }

  /**
   * Called for instance culling.
   */
  getBounds() {
    return this.model.bounds;
  }

  /**
   * Called if the instance is shown and not culled.
   */
  updateAnimations(dt: number) {

  }

  /**
   * Clears any objects that were emitted by this instance.
   */
  clearEmittedObjects() {

  }

  /**
   * Update this model instance.
   * 
   * Called automatically by the scene that owns this model instance.
   */
  updateObject(dt: number, scene: Scene) {
    if (this.updateFrame < this.model.viewer.frame) {
      if (this.rendered && !this.paused) {
        this.updateAnimations(dt);
      }

      this.updateFrame = this.model.viewer.frame;
    }
  }

  /**
   * Sets the scene of this instance.
   * 
   * This is equivalent to scene.addInstance(instance).
   */
  setScene(scene: Scene) {
    return scene.addInstance(this);
  }

  recalculateTransformation() {
    super.recalculateTransformation();

    if (this.scene) {
      this.scene.grid.moved(this);
    }
  }

  renderOpaque() {

  }

  renderTranslucent() {

  }

  isVisible(camera: Camera) {
    let [x, y, z] = this.worldLocation;
    let [sx, sy, sz] = this.worldScale;
    let bounds = this.getBounds();
    let planes = camera.planes;

    // Get the biggest scaling dimension.
    if (sy > sx) {
      sx = sy;
    }

    if (sz > sx) {
      sx = sz;
    }

    this.plane = testSphere(planes, x + bounds.x, y + bounds.y, z + bounds.z, bounds.r * sx, this.plane);

    if (this.plane === -1) {
      this.depth = distanceToPlane3(planes[4], x, y, z);

      return true;
    }

    return false;
  }
}
