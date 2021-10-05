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

    const path = attachment.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx');

    this.path = path;
    this.attachmentId = attachment.attachmentId;

    // Second condition is against custom resources using arbitrary paths...
    if (path !== '' && path.indexOf('.mdx') != -1) {
      const promise = model.viewer.load(path, model.pathSolver, model.solverParams);

      promise.then((model) => {
        if (model) {
          this.internalModel = <MdxModel>model;
        }
      });

      model.blockers.push(promise);
    }
  }

  override getVisibility(out: Float32Array, sequence: number, frame: number, counter: number): number {
    return this.getScalarValue(out, 'KATV', sequence, frame, counter, 1);
  }
}
