import Handler from './handler';
import common from './common';

const TextureHandler = {
    get objectType() {
        return "texturehandler"
    }
};

common.mix(TextureHandler, Handler);

export default TextureHandler;
