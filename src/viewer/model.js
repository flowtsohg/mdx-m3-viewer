import Resource from './resource';
import Bounds from './bounds';

/**
 * A model.
 */
export default class Model extends Resource {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    /** @member {number} */
    this.batchSize = resourceData.viewer.batchSize;
    /**
     * This is an array of instances that were created before the model loaded.
     * When it is loaded, they will be initialized, and then this array will be cleared.
     *
     * @member {Array<ModelInstance>} */
    this.preloadedInstances = [];
    /** @member {Array<ModelView>} */
    this.views = [];
    /** @member {Bounds} */
    this.bounds = new Bounds();
  }

  /**
   * Adds a new instance to this model, and returns it.
   *
   * @return {ModelInstance}
   */
  addInstance() {
    let views = this.views;
    let instance = new this.handler.Instance(this);

    if (views.length === 0) {
      this.addView();
    }

    instance.modelView = views[0];

    if (this.ok) {
      instance.load();
    } else {
      this.preloadedInstances.push(instance);
    }

    return instance;
  }

  /**
   * Render opaque things.
   *
   * @param {ModelViewData} modelViewData
   */
  renderOpaque(modelViewData) {

  }

  /**
   * Render translucent things.
   *
   * @param {ModelViewData} modelViewData
   */
  renderTranslucent(modelViewData) {

  }

  /**
   * Create a new model view for this model, and return it.
   *
   * @return {ModelView}
   */
  addView() {
    let view = new this.handler.View(this);

    this.views.push(view);

    return view;
  }

  /**
   * Remove a model view from this model.
   *
   * @param {*} modelView
   */
  removeView(modelView) {
    let views = this.views;

    views.splice(views.indexOf(modelView), 1);
  }

  /**
   * Called every time an instance changes a model view.
   * This generally corresponds to the instance creation, and to texture overriding.
   *
   * @param {ModelInstance} instance
   * @param {Object} shallowView
   */
  viewChanged(instance, shallowView) {
    let view = this.matchingView(shallowView);

    instance.modelView = view;

    // If the instance is already in a scene, and this is a new view, it will not be in the scene, so add it.
    if (instance.scene) {
      instance.scene.viewChanged(instance);
    }
  }

  /**
   * @param {Object} shallowView
   * @return {ModelView}
   */
  matchingView(shallowView) {
    // Check if there's another view that matches the instance
    for (let view of this.views) {
      if (view.equals(shallowView)) {
        return view;
      }
    }

    // Since no view matched, create a new one
    let view = this.addView();

    view.applyShallowCopy(shallowView);

    return view;
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
