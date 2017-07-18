import TextureHandler from '../../src/texturehandler';
import common from '../../src/common';

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

common.mix(Tga, TextureHandler);

export default Tga;
