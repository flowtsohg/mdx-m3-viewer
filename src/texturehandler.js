import Handler from './handler';

const TextureHandler = {
    get objectType() {
        return "texturehandler"
    }
};

require('./common').mix(TextureHandler, Handler);

export default TextureHandler;
