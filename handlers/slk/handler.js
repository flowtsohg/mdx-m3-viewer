import FileHandler from "../../src/filehandler";
import SlkFile from "./file";
import { mix } from "../../src/common";

const Slk = {
    get extension() {
        return ".slk";
    },

    get Constructor() {
        return SlkFile;
    }
};

mix(Slk, FileHandler);

export default Slk;
