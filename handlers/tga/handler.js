const Tga = {
    get extension() {
        return ".tga";
    },

    get Constructor() {
        return TgaTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Tga, TextureHandler);
