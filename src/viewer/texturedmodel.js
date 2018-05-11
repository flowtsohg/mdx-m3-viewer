import Model from './model';

export default class TexturedModel extends Model {
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

        this.viewer.webgl.bindTexture(texture, unit);
    }
};
