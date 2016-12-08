const Blp = {
    get extension() {
        return ".blp";
    },

    get Constructor() {
        return BlpTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Blp, TextureHandler);
