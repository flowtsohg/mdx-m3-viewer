/**
 * @class
 * @classdesc A geometry model view.
 * @extends ModelView
 * @memberOf Geo
 * @param {GeometryModel} model The model that this view belongs to.
 */
function GeometryModelView(model) {
    ModelView.call(this, model);

    /** @member {?Texture} */
    this.texture = null;
}

mix(GeometryModelView.prototype, ModelView.prototype);
