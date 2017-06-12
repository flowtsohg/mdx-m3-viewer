/**
 * @constructor
 * @extends TexturedModelView
 * @memberOf M3
 * @param {M3Model} model
 */
function M3ModelView(model) {
    TexturedModelView.call(this, model);
}

mix(M3ModelView.prototype, TexturedModelView.prototype);
