import { mix } from "../../common";
import FileHandler from "../../filehandler";
import SlkFile from "./file";

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
