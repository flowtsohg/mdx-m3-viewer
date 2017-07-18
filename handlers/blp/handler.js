import TextureHandler from '../../src/texturehandler';
import common from '../../src/common';

const Blp = {
    get extension() {
        return ".blp";
    },

    get Constructor() {
        return BlpTexture;
    },

    get binaryFormat() {
        return true;
    }
};

common.mix(Blp, TextureHandler);

export default Blp;
