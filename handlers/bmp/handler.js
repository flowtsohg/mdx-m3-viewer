const Bmp = {
    get extension() {
        return ".bmp";
    },

    get Constructor() {
        return BmpTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Bmp, TextureHandler);
