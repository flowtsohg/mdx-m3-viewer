function MdxModelView(model) {
    ModelView.call(this, model);

    this.textures = [];
}

MdxModelView.prototype = {
    replaceTextureById(id, newTexture) {
        this.textures[id] = newTexture;
    },

    replaceTextureByPath(path, newTexture) {
        let textures = this.model.texturePaths;

        for (let i = 0, l = textures.length; i < l; i++) {
            let texture = textures[i];

            if (texture === path) {
                this.textures[i] = newTexture;

                return true;
            }
        }

        return false;
    },
};

mix(MdxModelView.prototype, ModelView.prototype);
