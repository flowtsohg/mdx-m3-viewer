import mix from '../common/mix';
import Handler from './handler';

let TextureHandler = {
    get objectType() {
        return 'texturehandler'
    }
};

mix(TextureHandler, Handler);

export default TextureHandler;
