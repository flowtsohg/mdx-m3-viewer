import Resource from './resource';
import Bounds from './bounds';
import ModelInstance from './modelinstance';

/**
 * A model.
 */
export default class Model extends Resource {
  /**
   * An array of instances that were created before the model loaded.
   * When the model loads, the instances are loaded, and the array is cleared.
   */
  preloadedInstances: ModelInstance[];
  bounds: Bounds;

  constructor(resourceData: ResourceData) {
    super(resourceData);

    this.preloadedInstances = [];
    this.bounds = new Bounds();
  }

  /**
   * Adds a new instance to this model, and returns it.
   */
  addInstance(type: number = 0) {
    let Instance = this.handler.Instance[type];
    let instance = new Instance(this);

    if (this.ok) {
      instance.load();
    } else {
      this.preloadedInstances.push(instance);
    }

    return instance;
  }

  /**
   * Called when the model finishes loading.
   * Automatically finalizes loading for all of the model instances.
   */
  lateLoad() {
    for (let instance of this.preloadedInstances) {
      instance.load();

      // If an instance was created and attached to a scene before the model finished loading, it was rejected by the scene.
      // Therefore re-add it now that the model is loaded.
      let scene = instance.scene;

      if (scene) {
        instance.scene = null;
        scene.addInstance(instance);
      }
    }

    // Remove references to the instances.
    this.preloadedInstances.length = 0;
  }
}
