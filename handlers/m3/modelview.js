/**
 * @class
 * @classdesc An M3 model view.
 * @extends ModelView
 * @memberOf M3
 * @param {M3Model} model The model that this view belongs to.
 */
function M3ModelView(model) {
    ModelView.call(this, model);

    /** @member {Texture[]} */
    this.textures = [];
}

mix(MdxModelView.prototype, ModelView.prototype);
