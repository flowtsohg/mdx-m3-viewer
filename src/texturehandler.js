const TextureHandler = {
    get objectType() {
        return "texturehandler"
    },

    get Texture() {
        throw "TextureHandler.Texture must be overriden!";
    }
};

mix(TextureHandler, Handler);
