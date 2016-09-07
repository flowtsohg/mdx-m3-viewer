const Bmp = {
    get extension() {
        return ".bmp";
    },

    get Texture() {
        return BmpTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Bmp, TextureHandler);
