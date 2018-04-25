import ModelView from './modelview';

export default class TexturedModelView extends ModelView {
    /**
     * @param {Model} model
     */
    constructor(model) {
        super(model);

        /** @member {Map<Texture, Texture>} */
        this.textures = new Map();
    }

    getShallowCopy() {
        return { textures: new Map(this.textures) };
    }

    applyShallowCopy(view) {
        let textures = this.textures;

        for (let [src, dst] of view.textures) {
            textures.set(src, dst)
        }
    }

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
