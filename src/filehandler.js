import Handler from "./handler";
import { mix } from "./common";

const FileHandler = {
    get objectType() {
        return "filehandler"
    }
};

mix(FileHandler, Handler);

export default FileHandler;
