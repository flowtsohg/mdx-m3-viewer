/**
 * @class
 * @classdesc A model. The point of this viewer.
 * @extends DownloadableResource
 * @param {ModelViewer} env The model viewer object that this model belongs to.
 * @param {function} pathSolver A function that solves paths. See more {@link LoadPathSolver here}.
 */
function TexturedModel(env, pathSolver) {
    Model.call(this, env, pathSolver);
}

TexturedModel.prototype = {
    bindTexture(texture, unit, modelView) {
        let textures = modelView.textures;

        if (textures.has(texture)) {
            texture = textures.get(texture);
        }

        this.env.webgl.bindTexture(texture, unit);
    }
};

mix(TexturedModel.prototype, Model.prototype);
