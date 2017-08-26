import mix from "./mix";
import Handler from "./handler";

let TextureHandler = {
    get objectType() {
        return "texturehandler"
    }
};

mix(TextureHandler, Handler);

export default TextureHandler;
