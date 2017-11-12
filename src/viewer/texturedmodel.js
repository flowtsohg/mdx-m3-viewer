import mix from '../common/mix';
import Model from './model';

/**
 * @constructor
 * @augments Model
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function TexturedModel(env, pathSolver, handler, extension) {
    Model.call(this, env, pathSolver, handler, extension);
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

mix(TexturedModel.prototype, Model.prototype);

export default TexturedModel;
