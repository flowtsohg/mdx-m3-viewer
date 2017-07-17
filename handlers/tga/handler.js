import TextureHandler from '../../src/texturehandler';

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

require('../../src/common').mix(Tga, TextureHandler);

export default Tga;
