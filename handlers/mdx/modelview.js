/**
 * @class
 * @classdesc An MDX model view.
 * @extends ModelView
 * @memberOf Mdx
 * @param {MdxModel} model The model that this view belongs to.
 */
function MdxModelView(model) {
    ModelView.call(this, model);

    /** @member {Texture[]} */
    this.textures = [];
}

mix(MdxModelView.prototype, ModelView.prototype);
