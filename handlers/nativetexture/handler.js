const TextureHandler = require('../../src/texturehandler');

const NativeTexture = {
    get extension() {
        return ".png|.jpg|.gif";
    },

    get Constructor() {
        return ImageTexture;
    },

    get binaryFormat() {
        return true;
    }
};

require('../../src/common').mix(NativeTexture, TextureHandler);

module.exports = TextureHandler;
