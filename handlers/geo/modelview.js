/**
 * @constructor
 * @extends ModelView
 * @memberOf Geo
 * @param {GeometryModel} model
 */
function GeometryModelView(model) {
    ModelView.call(this, model);

    /** @member {?Texture} */
    this.texture = null;
}

mix(GeometryModelView.prototype, ModelView.prototype);
