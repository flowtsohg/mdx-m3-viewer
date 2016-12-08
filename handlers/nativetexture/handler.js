const NativeTexture = {
    get extension() {
        return ".png|.jpg|.gif";
    },

    get Constructor() {
        return PngTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(NativeTexture, TextureHandler);
