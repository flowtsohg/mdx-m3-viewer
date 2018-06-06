import GenericObject from './genericobject';

/**
 * An MDX attachment.
 */
export default class Attachment extends GenericObject {
  /**
   * @param {Model} model
   * @param {mdlx.Attachment} attachment
   * @param {number} index
   */
  constructor(model, attachment, index) {
    super(model, attachment, index);

    let path = attachment.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx');

    this.path = path;
    this.attachmentId = attachment.attachmentId;

    // Second condition is against custom resources using arbitrary paths...
    if (path !== '' && path.indexOf('.mdx') != -1) {
      this.internalModel = model.viewer.load(path, model.pathSolver);
    }
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVisibility(instance) {
    return this.getValue('KATV', instance, 1);
  }
}
