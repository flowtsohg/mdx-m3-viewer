import mix from "./mix";
import Handler from "./handler";

let FileHandler = {
    get objectType() {
        return "filehandler"
    }
};

mix(FileHandler, Handler);

export default FileHandler;
