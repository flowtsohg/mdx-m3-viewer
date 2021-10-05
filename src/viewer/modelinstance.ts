import { testSphere, distanceToPlane3 } from '../common/gl-matrix-addon';
import { Node } from './node';
import Model from './model';
import Scene from './scene';
import Camera from './camera';
import Texture from './texture';
import Bounds from './bounds';

/**
 * A model instance.
 */
export default abstract class ModelInstance extends Node {
  scene: Scene | null = null;
  left = -1;
  right = -1;
  bottom = -1;
  top = -1;
  plane = -1;
  depth = 0;
  updateFrame = 0;
  model: Model;
  /**
   * Allows to slow down or speed up animations of this instance, and any children.
   */
  timeScale = 1;
  /**
   * If false, this instance won't be rendered.
   * 
   * When working with Warcraft 3 instances, it is preferable to use hide() and show().
   * These hide and show also internal instances of this instance.
   */
  rendered = true;
  textureOverrides: Map<number, Texture> = new Map();

  constructor(model: Model) {
    super();

    this.model = model;
  }

  /**
   * This instance should be shown.
   */
  show(): void {
    this.rendered = true;
  }

  /**
   * This instance should be hidden.
   */
  hide(): void {
    this.rendered = false;
  }

  /**
   * Should the instance be shown?
   */
  shown(): boolean {
    return this.rendered;
  }

  /**
   * Should the instance be hidden?
   */
  hidden(): boolean {
    return !this.rendered;
  }

  /**
   * Detach this instance from the scene it's in.
   * 
   * Equivalent to scene.removeInstance(instance).
   */
  detach(): boolean {
    if (this.scene) {
      return this.scene.removeInstance(this);
    }

    return false;
  }

  overrideTexture(index: number, texture?: Texture): void {
    if (texture) {
      this.textureOverrides.set(index, texture);
    } else {
      this.textureOverrides.delete(index);
    }
  }

  /**
   * Called for instance culling.
   */
  getBounds(): Bounds {
    return this.model.bounds;
  }

  /**
   * Clears any objects that were emitted by this instance.
   */
  clearEmittedObjects(): void {

  }

  /**
   * Sets the scene of this instance.
   * 
   * This is equivalent to scene.addInstance(instance).
   */
  setScene(scene: Scene): boolean {
    return scene.addInstance(this);
  }

  override recalculateTransformation(): void {
    super.recalculateTransformation();

    if (this.scene) {
      this.scene.grid.moved(this);
    }
  }

  override update(dt: number): void {
    const scene = this.scene;

    if (scene && this.rendered && this.isVisible(scene.camera)) {
      // Add this instance to the render list.
      scene.renderInstance(this);

      // Update this instance.
      this.updateAnimations(dt * this.timeScale);

      // Update child nodes if there are any, such as instances parented to instances.
      super.update(dt);
    }
  }

  updateAnimations(_dt: number): void {

  }

  renderOpaque(): void {

  }

  renderTranslucent(): void {

  }

  isVisible(camera: Camera): boolean {
    const [x, y, z] = this.worldLocation;
    const [sx, sy, sz] = this.worldScale;
    const bounds = this.getBounds();
    const planes = camera.planes;
    let biggest = sx;

    // Get the biggest scaling dimension.
    if (sy > biggest) {
      biggest = sy;
    }

    if (sz > biggest) {
      biggest = sz;
    }

    this.plane = testSphere(planes, x + bounds.x, y + bounds.y, z + bounds.z, bounds.r * biggest, this.plane);

    if (this.plane === -1) {
      this.depth = distanceToPlane3(planes[4], x, y, z);

      return true;
    }

    return false;
  }
}
