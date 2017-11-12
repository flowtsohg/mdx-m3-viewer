import mix from '../../../common/mix';
import TextureHandler from '../../texturehandler';
import ImageTexture from './texture';

const NativeTexture = {
    get extensions() {
        return [
            ['.png', true],
            ['.jpg', true],
            ['.gif', true]
        ];
    },

    get Constructor() {
        return ImageTexture;
    }
};

mix(NativeTexture, TextureHandler);

export default NativeTexture;
