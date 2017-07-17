const BmpTexture = require('./texture');
const TextureHandler = require('../../src/texturehandler');

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

require('../../src/common').mix(Bmp, TextureHandler);

module.exports = Bmp;
