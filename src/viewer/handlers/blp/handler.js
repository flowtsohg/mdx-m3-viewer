import mix from '../../../common/mix';
import TextureHandler from '../../texturehandler';
import BlpTexture from './texture';

const Blp = {
    get extensions() {
        return [
            ['.blp', true]
        ];
    },

    get Constructor() {
        return BlpTexture;
    }
};

mix(Blp, TextureHandler);

export default Blp;
