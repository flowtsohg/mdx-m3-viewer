import TextureHandler from '../../src/texturehandler';
import common from '../../src/common';

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

common.mix(NativeTexture, TextureHandler);

export default TextureHandler;
