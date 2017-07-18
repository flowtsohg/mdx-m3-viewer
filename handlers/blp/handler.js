import TextureHandler from "../../src/texturehandler";
import BlpTexture from "./texture";
import { mix } from "../../src/common";

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
