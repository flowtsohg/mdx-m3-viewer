/**
 * A model view.
 *
 * Model views are used in cases where you want instances of the same model to have different rendering properties.
 * It is used for texture overriding.
 */
export default class ModelView {
  /**
   * @param {Model} model
   */
  constructor(model) {
    /** @member {Model} */
    this.model = model;

    this.instanceSet = new Set();
    this.sceneData = new Map();

    this.renderedInstances = 0;
    this.renderedParticles = 0;
    this.renderedBuckets = 0;
    this.renderCalls = 0;
  }

  /**
   * Get a shallow copy of this view.
   *
   * A shallow copy in this context means an object that any model view can be compared against.
   * This is used in equals() to test if two model views share the same properties.
   *
   * @return {Object|null}
   */
  getShallowCopy() {
    return null;
  }

  /**
   * Given a shallow copy returned by getShallowCopy(), apply it to this model view.
   *
   * @param {Object} view
   */
  applyShallowCopy(view) {

  }

  /**
   * Check if this model view is comparable to the given shallow view.
   *
   * @param {Object} view
   * @return {boolean}
   */
  equals(view) {
    return true;
  }

  /**
   * Called by the owning model when it finishes loading.
   */
  lateLoad() {
    for (let instance of this.instanceSet) {
      this.addSceneData(instance, instance.scene);
    }
  }

  /**
   * Add new per-scene data for the given instances.
   *
   * @param {ModelInstance} instance
   * @param {Scene} scene
   */
  addSceneData(instance, scene) {
    if (this.model.ok && scene) {
      let sceneData = this.sceneData;
      let data = sceneData.get(scene);

      if (!data) {
        data = this.createSceneData(scene);

        sceneData.set(scene, data);
      }

      data.instances.push(instance);
    }
  }

  /**
   * Does this view contain any instances for the given scene?
   *
   * @param {Scene} whichScene
   * @return {boolean}
   */
  hasInstances(whichScene) {
    for (let [scene, data] of this.sceneData) {
      if (scene === whichScene && data.instances.length > 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Add a new model instance to this model view.
   * If the instance was alraedy in this model view, returns false, otherwise returns true.
   *
   * @param {ModelInstance} instance
   * @return {boolean}
   */
  addInstance(instance) {
    let instanceSet = this.instanceSet;

    if (!instanceSet.has(instance)) {
      // If the instance is already in another view, remove it first.
      // This is always true, except when the instance is created and added to its first view.
      let modelView = instance.modelView;
      if (modelView) {
        modelView.removeInstance(instance);
      }

      // Add the instance
      instanceSet.add(instance);
      instance.modelView = this;

      this.addSceneData(instance, instance.scene);

      return true;
    }

    return false;
  }

  /**
   * Create a new scene data object.
   *
   * @param {Scene} scene
   * @return {Object}
   */
  createSceneData(scene) {
    return {
      scene,
      modelView: this,
      baseIndex: 0,
      instances: [],
      buckets: [],
      usedBuckets: 0,
    };
  }

  /**
   * Remove a model instance from this model view.
   * If the instance wasn't in this model view, returns false, otherwise returns true.
   *
   * @param {ModelInstance} instance
   * @return {boolean}
   */
  removeInstance(instance) {
    let instanceSet = this.instanceSet;

    if (instanceSet.delete(instance)) {
      let sceneData = this.sceneData;
      let scene = instance.scene;

      if (scene) {
        let data = sceneData.get(scene);
        let instances = data.instances;
        let buckets = data.buckets;

        // Remove the instance from its scene data.
        instances.splice(instances.indexOf(instance), 1);

        // See how many buckets are needed to hold all of the instances.
        let neededBuckets = Math.ceil(instances.length / this.model.batchSize);

        // If there are more buckets than are needed, remove them.
        if (neededBuckets < buckets.length) {
          buckets.length = neededBuckets;
        }
      }

      instance.modelView = null;

      // If this view has no instances, ask the model to remove it.
      if (instanceSet.size === 0) {
        // / TODO: THIS NEEDS TO ALSO UPDATE ALL SCENES???
        this.model.removeView(this);
      }

      return true;
    }

    return false;
  }

  /**
   * Called every time an instance changes its scene via scene.addInstance(instance) or instance.setScene(scene).
   *
   * @param {ModelInstance} instance
   * @param {Scene} scene
   */
  sceneChanged(instance, scene) {
    if (this.model.ok) {
      let sceneData = this.sceneData;
      let oldScene = instance.scene;

      if (oldScene) {
        let data = sceneData.get(oldScene);
        let instances = data.instances;
        let buckets = data.buckets;

        // Remove the instance from its scene data.
        instances.splice(instances.indexOf(instance), 1);

        // See how many buckets are needed to hold all of the instances.
        let neededBuckets = Math.ceil(instances.length / this.model.batchSize);

        // If there are more buckets than are needed, remove them.
        if (neededBuckets < buckets.length) {
          buckets.length = neededBuckets;
        }
      }

      if (scene) {
        this.addSceneData(instance, scene);
      }
    }
  }

  /**
   * Clear this model view from instances.
   *
   * TODO:Implement this.
   */
  clear() {

  }

  /**
   * Detach this model view from its model viewer.
   *
   * TODO: Implement this.
   */
  detach() {

  }

  /**
   * Update this model view.
   * This invovles updating all of its buckets, particle emitters, and whatever else is needed.
   *
   * If this model view actually has data for the given scene, it will be returned. Otherwise null is returned.
   *
   * @param {Scene} scene
   * @return {Object|null}
   */
  update(scene) {
    if (this.model.ok) {
      let data = this.sceneData.get(scene);

      if (data) {
        let instancesCount = data.instances.length;
        let buckets = data.buckets;

        data.baseIndex = 0;
        data.usedBuckets = 0;

        while (data.baseIndex < instancesCount) {
          if (data.usedBuckets === buckets.length) {
            buckets[data.usedBuckets] = new this.model.handler.Bucket(this);
          }

          data.baseIndex = buckets[data.usedBuckets].fill(data);
          data.usedBuckets += 1;
        }

        return data;
      }
    }

    return null;
  }

  /**
   * Tell the model to render opaque things in this model view.
   *
   * @param {Scene} scene
   */
  renderOpaque(scene) {
    let data = this.sceneData.get(scene);

    if (data && data.baseIndex) {
      this.model.renderOpaque(data);
    }
  }

  /**
   * Tell the model to render translucent things in this model view.
   *
   * @param {Scene} scene
   */
  renderTranslucent(scene) {
    let data = this.sceneData.get(scene);

    if (data && data.baseIndex) {
      this.model.renderTranslucent(data);
    }
  }
}
