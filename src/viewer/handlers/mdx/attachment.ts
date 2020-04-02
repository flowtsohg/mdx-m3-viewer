import MdlxAttachment from '../../../parsers/mdlx/attachment';
import GenericObject from './genericobject';
import MdxModel from './model';

/**
 * An MDX attachment.
 */
export default class Attachment extends GenericObject {
  path: string;
  attachmentId: number;
  internalModel: MdxModel | null = null;

  constructor(model: MdxModel, attachment: MdlxAttachment, index: number) {
    super(model, attachment, index);

    let path = attachment.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx');

    this.path = path;
    this.attachmentId = attachment.attachmentId;

    // Second condition is against custom resources using arbitrary paths...
    if (path !== '' && path.indexOf('.mdx') != -1) {
      this.internalModel = <MdxModel>model.viewer.load(path, model.pathSolver, model.solverParams);
    }
  }

  getVisibility(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KATV', sequence, frame, counter, 1);
  }
}
