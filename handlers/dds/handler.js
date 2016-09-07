const Dds = {
    get extension() {
        return ".dds";
    },

    get Texture() {
        return DdsTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Dds, TextureHandler);
