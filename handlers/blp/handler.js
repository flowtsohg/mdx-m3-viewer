const Blp = {
    get extension() {
        return ".blp";
    },

    get Texture() {
        return BlpTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Blp, TextureHandler);
