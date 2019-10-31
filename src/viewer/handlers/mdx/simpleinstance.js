import ModelInstance from '../../modelinstance';

/**
 * An MDX model instance.
 */
export default class MdxSimpleInstance extends ModelInstance {
  /**
   * @param {MdxModel} model
   */
  constructor(model) {
    super(model);


  }

  /**
   * @override
   */
  load() {
    let model = this.model;
  }

  /**
   * @override
   */
  renderOpaque() {
    this.scene.addToBatch(this);
  }
}
