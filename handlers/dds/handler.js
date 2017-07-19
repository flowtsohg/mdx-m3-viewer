import TextureHandler from "../../src/texturehandler";
import DdsTexture from "./texture";
import { mix } from "../../src/common";

const Dds = {
    get extension() {
        return ".dds";
    },

    get Constructor() {
        return DdsTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(Dds, TextureHandler);

export default Dds;
