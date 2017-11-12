import mix from '../../../common/mix';
import TextureHandler from '../../texturehandler';
import BmpTexture from './texture';

const Bmp = {
    get extensions() {
        return [
            ['.bmp', true]
        ];
    },

    get Constructor() {
        return BmpTexture;
    }
};

mix(Bmp, TextureHandler);

export default Bmp;
