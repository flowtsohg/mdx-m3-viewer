import { mix } from "../../common";
import TextureHandler from "../../texturehandler";
import ImageTexture from "./texture";

const NativeTexture = {
    get extension() {
        return ".png|.jpg|.gif";
    },

    get Constructor() {
        return ImageTexture;
    },

    get binaryFormat() {
        return true;
    }
};

mix(NativeTexture, TextureHandler);

export default NativeTexture;
