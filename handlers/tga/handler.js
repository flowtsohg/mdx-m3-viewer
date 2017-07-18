import TextureHandler from "../../src/texturehandler";
import TgaTexture from "./texture";
import { mix } from "../../src/common";

const Tga = {
    get extension() {
        return ".tga";
    },

    get Constructor() {
        return TgaTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Tga, TextureHandler);

export default Tga;
