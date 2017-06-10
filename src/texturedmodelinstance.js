/**
 * @class
 * @classdesc An instance of a model, and an entity in the world that you can see, and move around.
 * @extends AsyncResource
 * @extends NotifiedNode
 * @param {ModelViewer} env The model viewer object that this instance belongs to.
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
