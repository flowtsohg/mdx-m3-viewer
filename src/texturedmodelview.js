/**
 * @class
 * @classdesc This class holds all of the model instances.
 *            It is used to possibly give multiple "views" of the same model.
 *            That is, use the same base model, but have some variations on a per-view basis, hence giving multiple versions of the model.
 *            Mostly used for texture overriding, to allow having multiple instances with different textures.
 * @param {Model} model The model that this view belongs to.
 */
function TexturedModelView(model) {
    ModelView.call(this, model);

    /** @member {Map.<Texture, Texture>} */
    this.textures = new Map();
}

TexturedModelView.prototype = {
    getShallowCopy() {
        return { textures: new Map(this.textures) };
    },

    applyShallowCopy(view) {
        let textures = this.textures,
            dstTextures = view.textures;

        for (let [src, dst] of dstTextures) {
            textures.set(src, dst)
        }
    },

    equals(view) {
        let textures = this.textures,
            dstTextures = view.textures;

        if (textures.length !== dstTextures.length) {
            return false;
        }

        for (let [src, dst] of dstTextures) {
            if (textures.get(src) !== dst) {
                return false;
            }
        }

        return true;
    }
};

mix(TexturedModelView.prototype, ModelView.prototype);
