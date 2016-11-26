const TextureHandler = {
    get objectType() {
        return "texturehandler"
    },

    get Texture() {
        throw new Error("TextureHandler.Texture must be overriden!");
    }
};

mix(TextureHandler, Handler);
