/**
 * @constructor
 * @mixes ModelInstance
 * @param {Model} model
 */
function TexturedModelInstance(model) {
    ModelInstance.call(this, model);
}

TexturedModelInstance.prototype = {
    setTexture(which, texture) {
        let view = this.modelView.getShallowCopy();

        view.textures.set(which, texture);

        this.model.viewChanged(this, view);
    }
};

mix(TexturedModelInstance.prototype, ModelInstance.prototype);
