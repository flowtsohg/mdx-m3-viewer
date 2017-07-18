import BmpTexture from './texture';
import TextureHandler from '../../src/texturehandler';
import common from '../../src/common';

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

common.mix(Bmp, TextureHandler);

export default Bmp;
