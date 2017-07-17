import BmpTexture from './texture';
import TextureHandler from '../../src/texturehandler';

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

export default Bmp;
