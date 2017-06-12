/**
 * @constructor
 * @mixes Model
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
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
