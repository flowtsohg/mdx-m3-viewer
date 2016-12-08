const Dds = {
    get extension() {
        return ".dds";
    },

    get Constructor() {
        return DdsTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Dds, TextureHandler);
