import ModelInstance from "./modelinstance";
import { mix } from "./common";

/**
 * @constructor
 * @augments ModelInstance
 * @param {Model} model
 */
function TexturedModelInstance(model) {
    ModelInstance.call(this, model);
}

TexturedModelInstance.prototype = {
    /*
     * Overrides a texture with another one.
     * 
     * @param {Texture} which
     * @param {Texture} texture
     */
    setTexture(which, texture) {
        let view = this.modelView.getShallowCopy();

        view.textures.set(which, texture);

        this.model.viewChanged(this, view);
    }
};

mix(TexturedModelInstance.prototype, ModelInstance.prototype);

export default TexturedModelInstance;
