import mix from "../../mix";
import FileHandler from "../../filehandler";
import SlkFile from "./file";

const Slk = {
    get extensions() {
        return [
            [".slk", false]
        ];
    },

    get Constructor() {
        return SlkFile;
    }
};

mix(Slk, FileHandler);

export default Slk;
