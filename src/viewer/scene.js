import {vec3} from 'gl-matrix';
import Camera from './camera';
import QuadTree from './quadtree';

// Heap allocations needed for this module.
let ndcHeap = new Float32Array(3);

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
    /** @member {Array<ModelViewer.viewer.ModelView>} */
    /** @member {boolean} */
    this.rendered = true;

    /** @member {Array<ModelViewData} */
    this.modelViewsData = [];
    /** @member {Map<ModelView, ModelViewData} */
    this.modelViewsDataMap = new Map();

    /** @member {number} */
    this.renderedCells = 0;
    /** @member {number} */
    this.renderedBuckets = 0;
    /** @member {number} */
    this.renderedInstances = 0;
    /** @member {number} */
    this.renderedParticles = 0;

    /** @member {boolean} */
    this.audioEnabled = false;
    /** @member {?AudioContext} */
    this.audioContext = null;

    // Use the whole canvas, and standard perspective projection values.
    this.camera.viewport([0, 0, canvas.width, canvas.height]);
    this.camera.perspective(Math.PI / 4, canvas.width / canvas.height, 8, 10000);

    this.tree = new QuadTree([-100000, -100000], [200000, 200000], [200000, 200000]);
  }

  /**
   * Creates an AudioContext if one wasn't created already, and resumes it if needed.
   * The returned promise will resolve to whether it is actually running or not.
   * It may stay in suspended state indefinitly until the client interact with the page, due to browser policies.
   *
   * @return {Promise}
   */
  async enableAudio() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state !== 'suspended') {
      await this.audioContext.resume();
    }

    this.audioEnabled = this.audioContext.state === 'running';

    return this.audioEnabled;
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
        this.tree.add(instance);

        this.viewChanged(instance);

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
      this.tree.remove(instance);

      instance.scene = null;
      instance.modelViewData = null;

      return true;
    }

    return false;
  }

  /**
   * Called by Model when an instance changes its view, e.g. by using TexturedModelInstance.setTexture()
   *
   * @param {ModelInstance} instance
   */
  viewChanged(instance) {
    let modelViewsData = this.modelViewsData;
    let modelViewsDataMap = this.modelViewsDataMap;
    let modelView = instance.modelView;

    if (!modelViewsDataMap.has(modelView)) {
      let modelViewData = new instance.model.handler.Data(modelView, this);

      modelViewsData.push(modelViewData);
      modelViewsDataMap.set(modelView, modelViewData);
    }

    instance.modelViewData = modelViewsDataMap.get(modelView);
  }

  /**
   * Clear this scene.
   */
  clear() {
    /// TODO: UPDATE THIS
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
   * Update this scene.
   * This includes updating the scene's camera, the node hierarchy (model instances etc.), the rendering data, and the AudioContext's lisener's position if it exists.
   */
  update() {
    if (this.rendered) {
      // Update the camera.
      this.camera.update();

      // Update the autido context's position if it exists.
      if (this.audioContext) {
        let [x, y, z] = this.camera.location;

        this.audioContext.listener.setPosition(-x, -y, -z);
      }

      // Update all of the visible instances that have no parents.
      // Instances that have parents will be updated down the hierarcy automatically.
      for (let cell of this.tree.cells) {
        if (this.camera.testCell(cell)) {
          cell.rendered = true;

          for (let instance of cell.instances) {
            if (instance.rendered && !instance.parent) {
              instance.update(this);
            }
          }
        } else {
          cell.rendered = false;
        }
      }

      // Reset all of the buckets.
      for (let modelViewData of this.modelViewsData) {
        modelViewData.startFrame();
      }

      this.renderedCells = 0;
      this.renderedBuckets = 0;
      this.renderedInstances = 0;
      this.renderedParticles = 0;

      // Push all of the visible instances into the buckets.
      for (let cell of this.tree.cells) {
        if (cell.rendered) {
          this.renderedCells += 1;

          for (let instance of cell.instances) {
            if (instance.rendered) {
              let modelViewData = instance.modelViewData;

              modelViewData.renderInstance(instance);
              modelViewData.renderEmitters(instance);
            }
          }
        }
      }

      // Update the bucket buffers.
      for (let modelViewData of this.modelViewsData) {
        modelViewData.updateBuffers();
        modelViewData.updateEmitters();

        this.renderedBuckets += modelViewData.usedBuckets;
        this.renderedInstances += modelViewData.instances;
        this.renderedParticles += modelViewData.particles;
      }
    }
  }

  /**
   * Tests if an instance is currently visible in this scene.
   * If the model has a bounding sphere, it will be used. Otherwise checks only the location of the instance.
   *
   * @param {ModelInstance} instance
   * @return {boolean}
   */
  isVisible(instance) {
    let model = instance.model;
    let bounds = model.bounds;

    // If the model has a bounding sphere in it, do a sphere test.
    // Otherwise do a point test.
    if (bounds) {
      let center = bounds.center;
      let location = instance.worldLocation;

      ndcHeap[0] = location[0] + center[0];
      ndcHeap[1] = location[1] + center[1];
      ndcHeap[2] = location[2] + center[2];

      return this.camera.testSphere(ndcHeap, bounds.radius);
    } else {
      let worldProjectionMatrix = this.camera.worldProjectionMatrix;

      // This test checks whether the instance's position is visible in NDC space. In other words, that it lies in [-1, 1] on all axes
      vec3.transformMat4(ndcHeap, instance.worldLocation, worldProjectionMatrix);
      if (ndcHeap[0] >= -1 && ndcHeap[0] <= 1 && ndcHeap[1] >= -1 && ndcHeap[1] <= 1 && ndcHeap[2] >= -1 && ndcHeap[2] <= 1) {
        return true;
      }

      return false;
    }
  }

  /**
   * Render all opaque things in this scene.
   * Automatically applies the camera's viewport.
   */
  renderOpaque() {
    if (this.rendered) {
      this.viewport();

      for (let modelViewData of this.modelViewsData) {
        modelViewData.renderOpaque(this);
      }
    }
  }

  /**
   * Renders all translucent things in this scene.
   * Automatically applies the camera's viewport.
   */
  renderTranslucent() {
    if (this.rendered) {
      this.viewport();

      for (let modelViewData of this.modelViewsData) {
        modelViewData.renderTranslucent(this);
      }
    }
  }

  /**
   * Set the viewport to that of this scene's camera.
   */
  viewport() {
    let viewport = this.camera.rect;

    this.viewer.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
  }

  /**
   * Clear all of the emitted objects in this scene.
   */
  clearEmittedObjects() {
    for (let cell of this.tree.cells) {
      for (let instance of cell.instances) {
        instance.clearEmittedObjects();
      }
    }
  }
}
