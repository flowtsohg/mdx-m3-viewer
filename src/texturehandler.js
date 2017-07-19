import Handler from "./handler";
import { mix } from "./common";

const TextureHandler = {
    get objectType() {
        return "texturehandler"
    }
};

mix(TextureHandler, Handler);

export default TextureHandler;
