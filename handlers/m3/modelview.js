/**
 * @class
 * @classdesc An M3 model view.
 * @extends TexturedModelView
 * @memberOf M3
 * @param {M3Model} model The model that this view belongs to.
 */
function M3ModelView(model) {
    TexturedModelView.call(this, model);
}

mix(M3ModelView.prototype, TexturedModelView.prototype);
