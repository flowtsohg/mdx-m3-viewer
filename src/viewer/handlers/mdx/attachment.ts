import MdlxAttachment from '../../../parsers/mdlx/attachment';
import GenericObject from './genericobject';
import MdxComplexInstance from './complexinstance';
import MdxModel from './model';

/**
 * An MDX attachment.
 */
export default class Attachment extends GenericObject {
  path: string;
  attachmentId: number;
  internalModel: MdxModel | null;

  constructor(model: MdxModel, attachment: MdlxAttachment, index: number) {
    super(model, attachment, index);

    let path = attachment.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx');

    this.path = path;
    this.attachmentId = attachment.attachmentId;
    this.internalModel = null;

    // Second condition is against custom resources using arbitrary paths...
    if (path !== '' && path.indexOf('.mdx') != -1) {
      this.internalModel = model.viewer.load(path, model.pathSolver, model.solverParams);
    }
  }

  getVisibility(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KATV', instance, 1);
  }
}
