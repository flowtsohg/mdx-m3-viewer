import ModelView from '../../modelview';

export default class GeometryModelView extends ModelView {
    /**
     * @param {GeometryModel} model
     */
    constructor(model) {
        super(model);

        /** @member {?Texture} */
        this.texture = null;
    }
};
