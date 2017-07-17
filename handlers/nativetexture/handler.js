import TextureHandler from '../../src/texturehandler';

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

export default TextureHandler;
