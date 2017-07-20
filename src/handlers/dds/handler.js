import { mix } from "../../common";
import TextureHandler from "../../texturehandler";
import DdsTexture from "./texture";

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
