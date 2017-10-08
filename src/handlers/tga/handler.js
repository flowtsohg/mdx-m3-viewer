import mix from '../../mix';
import TextureHandler from '../../texturehandler';
import TgaTexture from './texture';

const Tga = {
    get extensions() {
        return [
            ['.tga', true]
        ];
    },

    get Constructor() {
        return TgaTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Tga, TextureHandler);

export default Tga;
