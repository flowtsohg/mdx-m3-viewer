import Camera from './camera';
import Grid from './grid';
import EmittedObjectUpdater from './emittedobjectupdater';

/**
 * A scene.
 *
 * Every scene has its own list of model instances, and its own camera and viewport.
 *
 * In addition, every scene may have its own AudioContext if enableAudio() is called.
 * If audo is enabled, the AudioContext's listener's location will be updated automatically.
 * Note that due to browser policies, this may be done only after user interaction with the web page.
 */
export default class Scene {
  /**
   * @param {ModelViewer} viewer
   */
  constructor(viewer) {
    let canvas = viewer.canvas;

    /** @member {ModelViewer.viewer.ModelViewer} */
    this.viewer = viewer;
    /** @member {ModelViewer.viewer.Camera} */
    this.camera = new Camera();
    /** @member {Grid} */
    this.grid = new Grid(-100000, -100000, 200000, 200000, 200000, 200000);

    /** @member {number} */
    this.visibleCells = 0;
    /** @member {number} */
    this.visibleInstances = 0;
    /** @member {number} */
    this.updatedParticles = 0;

    /** @member {boolean} */
    this.audioEnabled = false;
    /** @member {?AudioContext} */
    this.audioContext = null;

    // Use the whole canvas, and standard perspective projection values.
    this.camera.viewport([0, 0, canvas.width, canvas.height]);
    this.camera.perspective(Math.PI / 4, canvas.width / canvas.height, 8, 10000);

    this.instances = [];
    this.currentInstance = 0;

    this.batchedInstances = [];
    this.currentBatchedInstance = 0;

    this.emittedObjectUpdater = new EmittedObjectUpdater();

    /**
     * @member {Map<TextureMapper, RenderBatch>}
     */
    this.batches = new Map();
  }

  /**
   * Creates an AudioContext if one wasn't created already, and resumes it if needed.
   * The returned promise will resolve to whether it is actually running or not.
   * It may stay in suspended state indefinitly until the user interacts with the page, due to browser policies.
   *
   * @return {Promise<boolean>}
   */
  async enableAudio() {
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
  disableAudio() {
    if (this.audioContext) {
      this.audioContext.suspend();
    }

    this.audioEnabled = false;
  }

  /**
   * Sets the scene of the given instance.
   * This is equivalent to instance.setScene(scene).
   *
   * @param {ModelInstance} instance
   * @return {boolean}
   */
  addInstance(instance) {
    if (instance.scene !== this) {
      if (instance.scene) {
        instance.scene.removeInstance(instance);
      }

      instance.scene = this;

      // Only allow instances that are actually ok to be added the scene.
      if (instance.model.ok) {
        this.grid.moved(instance);

        return true;
      }
    }

    return false;
  }

  /**
   * @param {ModelInstance} instance The instance to remove.
   * @return {boolean}
   */
  removeInstance(instance) {
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
  clear() {
    // First remove references to this scene stored in the instances.
    for (let cell of this.grid.cells) {
      for (let instance of cell.instances) {
        instance.scene = null;
      }
    }

    // Then remove references to the instances.
    this.grid.clear();
  }

  /**
   * Detach this scene from the viewer.
   * Equivalent to viewer.removeScene(scene).
   *
   * @return {boolean}
   */
  detach() {
    if (this.viewer) {
      return this.viewer.removeScene(this);
    }

    return false;
  }

  /**
   * @param {ModelInstance} instance
   */
  addToBatch(instance) {
    let textureMapper = instance.textureMapper;
    let batches = this.batches;
    let batch = batches.get(textureMapper);

    if (!batch) {
      let model = instance.model;
      let Batch = model.handler.Batch;

      batch = new Batch(this, model, textureMapper);

      batches.set(textureMapper, batch);
    }

    batch.add(instance);
  }

  /**
   * Update this scene.
   *
   * @param {number} dt
   */
  update(dt) {
    let camera = this.camera;

    // Update the camera.
    camera.update();

    // Update the audio context's position if it exists.
    if (this.audioContext) {
      let [x, y, z] = camera.location;
      let [forwardX, forwardY, forwardZ] = camera.directionY;
      let [upX, upY, upZ] = camera.directionZ;
      let listener = this.audioContext.listener;

      listener.setPosition(-x, -y, -z);
      listener.setOrientation(forwardX, forwardY, forwardZ, upX, upY, upZ);
    }

    let frame = this.viewer.frame;

    let instances = this.instances;
    let batchedInstances = this.batchedInstances;

    let currentInstance = 0;
    let currentBatchedInstance = 0;

    this.visibleCells = 0;
    this.visibleInstances = 0;

    // Update and collect all of the visible instances.
    for (let cell of this.grid.cells) {
      if (cell.isVisible(camera)) {
        this.visibleCells += 1;

        for (let instance of cell.instances) {
          if (instance.rendered && instance.cullFrame < frame && instance.isVisible(camera)) {
            instance.cullFrame = frame;

            if (instance.updateFrame < frame) {
              instance.update(dt, this);
            }

            if (instance.isBatched()) {
              batchedInstances[currentBatchedInstance++] = instance;
            } else {
              instances[currentInstance++] = instance;
            }

            this.visibleInstances += 1;
          }
        }
      }
    }

    batchedInstances.length = currentBatchedInstance;

    instances.length = currentInstance;
    instances.sort((a, b) => b.depth - a.depth);

    this.emittedObjectUpdater.update(dt);
    this.updatedParticles = this.emittedObjectUpdater.alive;
  }

  /**
   * Render all opaque things in this scene.
   * Automatically applies the camera's viewport.
   */
  renderOpaque() {
    let camera = this.camera;
    let viewport = camera.rect;

    this.viewer.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);

    // Clear all of the batches.
    for (let batch of this.batches.values()) {
      batch.clear();
    }

    // Add all of the batched instances to batches.
    for (let instance of this.batchedInstances) {
      this.addToBatch(instance);
    }

    // Render all of the batches.
    for (let batch of this.batches.values()) {
      batch.render();
    }

    // Render all of the opaque things of non-batched instances.
    for (let instance of this.instances) {
      instance.renderOpaque();
    }
  }

  /**
   * Renders all translucent things in this scene.
   * Automatically applies the camera's viewport.
   */
  renderTranslucent() {
    let camera = this.camera;
    let viewport = camera.rect;

    this.viewer.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);

    for (let instance of this.instances) {
      instance.renderTranslucent();
    }
  }

  /**
   * Clear all of the emitted objects in this scene.
   */
  clearEmittedObjects() {
    for (let object of this.emittedObjectUpdater.objects) {
      object.health = 0;
    }
  }
}
