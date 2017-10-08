import mix from '../../mix';
import TextureHandler from '../../texturehandler';
import DdsTexture from './texture';

const Dds = {
    get extensions() {
        return [
            ['.dds', true]
        ];
    },

    get Constructor() {
        return DdsTexture;
    }
};

mix(Dds, TextureHandler);

export default Dds;
