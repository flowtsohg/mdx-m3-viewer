import { mix } from "../../common";
import TextureHandler from "../../texturehandler";
import BmpTexture from "./texture";

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
