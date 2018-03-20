import ModelInstance from './modelinstance';

export default class TexturedModelInstance extends ModelInstance {
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
