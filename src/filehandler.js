import { mix } from "./common";
import Handler from "./handler";

const FileHandler = {
    get objectType() {
        return "filehandler"
    }
};

mix(FileHandler, Handler);

export default FileHandler;
