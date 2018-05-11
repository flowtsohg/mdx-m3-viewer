import GenericObject from './genericobject';

export default class Attachment extends GenericObject {
    constructor(model, attachment, pivotPoints, index) {
        super(model, attachment, pivotPoints, index);

        let path = attachment.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx');

        this.path = path;
        this.attachmentId = attachment.attachmentId;

        // Second condition is against custom resources using arbitrary paths...
        if (path !== '' && path.indexOf('.mdx') != -1) {
            this.internalModel = model.viewer.load(path, model.pathSolver);
        }
    }

    getVisibility(instance) {
        return this.getValue('KATV', instance, 1);
    }
};
