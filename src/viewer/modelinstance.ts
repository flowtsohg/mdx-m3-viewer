import { testSphere, distanceToPlane3 } from '../common/gl-matrix-addon';
import { Node } from './node';
import Model from './model';
import Scene from './scene';
import TextureMapper from './texturemapper';
import Texture from './texture';
import Camera from './camera';

/**
 * A model instance.
 */
export default abstract class ModelInstance extends Node {
  scene: Scene | null;
  left: number;
  right: number;
  bottom: number;
  top: number;
  plane: number;
  depth: number;
  updateFrame: number;
  cullFrame: number;
  model: Model;
  textureMapper: TextureMapper;
  paused: boolean;
  rendered: boolean;

  constructor(model: Model) {
    super();

    this.scene = null;
    this.left = -1;
    this.right = -1;
    this.bottom = -1;
    this.top = -1;
    this.plane = -1;
    this.depth = 0;
    this.updateFrame = 0;
    this.cullFrame = 0;
    this.model = model;
    this.textureMapper = model.viewer.baseTextureMapper(this);
    this.paused = false;
    this.rendered = true;
  }

  setTexture(key: any, texture?: Texture) {
    this.textureMapper = this.model.viewer.changeTextureMapper(this, key, texture);
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

  /**
   * Called once the model is loaded, or immediately if the model was already loaded.
   */
  load() {

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
    let bounds = this.model.bounds;
    let planes = camera.planes;

    this.plane = testSphere(planes, x + bounds.x, y + bounds.y, z, bounds.r, this.plane);

    if (this.plane === -1) {
      this.depth = distanceToPlane3(planes[4], x, y, z);

      return true;
    }

    return false;
  }

  isBatched() {
    return false;
  }
}
