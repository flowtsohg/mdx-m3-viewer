import { mix } from "./common";
import Handler from "./handler";

const TextureHandler = {
    get objectType() {
        return "texturehandler"
    }
};

mix(TextureHandler, Handler);

export default TextureHandler;
