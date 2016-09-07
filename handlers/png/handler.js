const Png = {
    get extension() {
        return ".png|.jpg|.gif";
    },

    get Texture() {
        return PngTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Png, TextureHandler);
