import { mix } from "../../common";
import TextureHandler from "../../texturehandler";
import BlpTexture from "./texture";

const Blp = {
    get extension() {
        return ".blp";
    },

    get Constructor() {
        return BlpTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Blp, TextureHandler);

export default Blp;
