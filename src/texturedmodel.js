const Model = require('./model');

/**
 * @constructor
 * @augments Model
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 */
function TexturedModel(env, pathSolver) {
    Model.call(this, env, pathSolver);
}

TexturedModel.prototype = {
    /*
     * Bind a texture to some texture unit.
     * Checks the model view for an override.
     * 
     * @param {Texture} texture
     * @param {number} unit
     * @param {ModelView} modelView
     */
    bindTexture(texture, unit, modelView) {
        let textures = modelView.textures;

        if (textures.has(texture)) {
            texture = textures.get(texture);
        }

        this.env.webgl.bindTexture(texture, unit);
    }
};

require('./common').mix(TexturedModel.prototype, Model.prototype);

module.exports = TexturedModel;
