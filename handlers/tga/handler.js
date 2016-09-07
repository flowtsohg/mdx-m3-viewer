const Tga = {
    get extension() {
        return ".tga";
    },

    get Texture() {
        return TgaTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Tga, TextureHandler);
