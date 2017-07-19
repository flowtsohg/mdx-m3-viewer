import TextureHandler from "../../src/texturehandler";
import ImageTexture from "./texture";
import { mix } from "../../src/common";

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
