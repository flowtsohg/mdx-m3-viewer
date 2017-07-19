import TextureHandler from "../../src/texturehandler";
import BmpTexture from "./texture";
import { mix } from "../../src/common";

const Bmp = {
    get extension() {
        return ".bmp";
    },

    get Constructor() {
        return BmpTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Bmp, TextureHandler);

export default Bmp;
