import { vec3, vec4 } from 'gl-matrix';
import ModelViewer from './viewer';
import Camera from './camera';
import Grid from './grid';
import ModelInstance from './modelinstance';
import EmittedObjectUpdater from './emittedobjectupdater';

/**
 * A scene.
 *
 * Every scene has its own list of model instances, and its own camera and viewport.
 *
 * In addition, every scene may have its own AudioContext if enableAudio() is called.
 * If audio is enabled, the AudioContext's listener's location will be updated automatically.
 * Note that due to browser policies, this may be done only after user interaction with the web page.
 */
export default class Scene {
  viewer: ModelViewer;
  camera = new Camera();
  grid = new Grid(-100000, -100000, 200000, 200000, 200000, 200000);
  visibleCells = 0;
  visibleInstances = 0;
  updatedParticles = 0;
  audioEnabled = false;
  audioContext: AudioContext | null = null;
  instances: ModelInstance[] = [];
  emittedObjectUpdater = new EmittedObjectUpdater();
  /**
   * Similar to WebGL's own `alpha` parameter.
   * 
   * If false, the scene will be cleared before rendering, meaning that scenes behind it won't be visible through it.
   * 
   * If true, alpha works as usual.
   */
  alpha = false;
  /**
   * The scene's background color.
   * 
   * Only used if `alpha` is false.
   */
  color = vec3.create();
  /**
   * The area on the canvas in which this scene is rendered.
   * 
   * Defaults to the entire canvas.
   * 
   * The vector defines [x, y, width, height], sizes are in pixels, and everything is related to the bottom left corner of the canvas.
   */
  viewport = vec4.create();
  /**
   * The position of the light that is used when rendering.
   * 
   * Affects HD MDX and M3 models.
   */
  lightPosition = vec3.fromValues(0, 0, 10000);

  constructor(viewer: ModelViewer) {
    this.viewer = viewer;

    const canvas = viewer.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Use the whole canvas by default.
    this.viewport[2] = width;
    this.viewport[3] = height;

    // And standard perspective projection.
    this.camera.perspective(Math.PI / 4, width / height, 8, 10000);
  }

  /**
   * Creates an AudioContext if one wasn't created already, and resumes it if needed.
   * 
   * The returned promise will resolve to whether it is actually running or not.
   * 
   * It may stay in suspended state indefinitly until the user interacts with the page, due to browser policies.
   */
  async enableAudio(): Promise<boolean> {
    if (typeof AudioContext === 'function') {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      if (this.audioContext.state !== 'suspended') {
        await this.audioContext.resume();
      }

      this.audioEnabled = this.audioContext.state === 'running';

      return this.audioEnabled;
    }

    return false;
  }

  /**
   * Suspend the audio context.
   */
  disableAudio(): void {
    if (this.audioContext) {
      this.audioContext.suspend();
    }

    this.audioEnabled = false;
  }

  /**
   * Sets the scene of the given instance.
   * 
   * Equivalent to instance.setScene(scene).
   */
  addInstance(instance: ModelInstance): boolean {
    if (instance.scene !== this) {
      if (instance.scene) {
        instance.scene.removeInstance(instance);
      }

      instance.scene = this;

      this.grid.moved(instance);

      return true;
    }

    return false;
  }

  /**
   * Remove the given instance from this scene.
   * 
   * Equivalent to ModelInstance.detach().
   */
  removeInstance(instance: ModelInstance): boolean {
    if (instance.scene === this) {
      this.grid.remove(instance);

      instance.scene = null;

      return true;
    }

    return false;
  }

  /**
   * Clear this scene.
   */
  clear(): void {
    // First remove references to this scene stored in the instances.
    for (const cell of this.grid.cells) {
      for (const instance of cell.instances) {
        instance.scene = null;
      }
    }

    // Then remove references to the instances.
    this.grid.clear();
  }

  /**
   * Detach this scene from the viewer.
   * 
   * Equivalent to viewer.removeScene(scene).
   */
  detach(): boolean {
    if (this.viewer) {
      return this.viewer.removeScene(this);
    }

    return false;
  }

  /**
   * Update this scene.
   */
  update(dt: number): void {
    const camera = this.camera;

    // Update the audio context's position if it exists.
    if (this.audioContext) {
      const listener = this.audioContext.listener;
      const position = camera.location;
      const forward = camera.directionY;
      const up = camera.directionZ;

      listener.positionX.value = -position[0];
      listener.positionY.value = -position[1];
      listener.positionZ.value = -position[2];

      listener.forwardX.value = forward[0];
      listener.forwardY.value = forward[1];
      listener.forwardZ.value = forward[2];

      listener.upX.value = up[0];
      listener.upY.value = up[1];
      listener.upZ.value = up[2];
    }

    const frame = this.viewer.frame;
    const instances = this.instances;

    this.visibleCells = 0;
    this.visibleInstances = 0;

    // Update and collect all of the visible instances.
    for (const cell of this.grid.cells) {
      if (cell.isVisible(camera)) {
        this.visibleCells += 1;

        for (const instance of cell.instances) {
          // If an instance is rendered, wasn't updated on this frame, and has no parent, update it.
          // If the instance is visible, it will be updated, all of its children will be updated, and it will be added to the render list.
          // Note that the update frame is needed because instances can exist in any number of cells at the same time.
          if (instance.rendered && instance.updateFrame < frame && !instance.parent) {
            instance.updateFrame = frame;
            instance.update(dt);
          }
        }
      }
    }

    // Sort the visible instances based on depth.
    instances.length = this.visibleInstances;
    instances.sort((a, b) => a.depth - b.depth);

    this.emittedObjectUpdater.update(dt);
    this.updatedParticles = this.emittedObjectUpdater.alive;
  }

  renderInstance(instance: ModelInstance): void {
    this.instances[this.visibleInstances++] = instance;
  }

  /**
   * Use the scene's viewport.
   * 
   * Should be called before `renderOpaque()` and `renderTranslucent()`.
   * 
   * Called automatically by `render()`.
   */
  startFrame(): void {
    const gl = this.viewer.gl;
    const viewport = this.viewport;

    // Set the viewport.
    gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);

    // Allow to render only in the viewport.
    gl.scissor(viewport[0], viewport[1], viewport[2], viewport[3]);

    // If this scene doesn't want alpha, clear it.
    if (!this.alpha) {
      const color = this.color;

      gl.depthMask(true);
      gl.clearColor(color[0], color[1], color[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
  }

  /**
   * Render opaque things in this scene.
   * 
   * They are rendered front to back.
   */
  renderOpaque(): void {
    const instances = this.instances;

    for (let i = 0, l = instances.length; i < l; i++) {
      instances[i].renderOpaque();
    }
  }

  /**
   * Renders translucent things in this scene.
   * 
   * They are rendered back to front.
   */
  renderTranslucent(): void {
    const instances = this.instances;

    for (let i = instances.length - 1; i >= 0; i--) {
      instances[i].renderTranslucent();
    }
  }

  /**
   * Render this scene.
   */
  render(): void {
    this.startFrame();
    this.renderOpaque();
    this.renderTranslucent();
  }

  /**
   * Clear all of the emitted objects in this scene.
   */
  clearEmittedObjects(): void {
    for (const object of this.emittedObjectUpdater.objects) {
      object.health = 0;
    }
  }
}
