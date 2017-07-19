import ModelView from "./modelview";
import { mix } from "./common";

/**
 * @constructor
 * @augments ModelView
 * @param {Model} model
 */
function TexturedModelView(model) {
    ModelView.call(this, model);

    /** @member {Map<Texture, Texture>} */
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

export default TexturedModelView;
