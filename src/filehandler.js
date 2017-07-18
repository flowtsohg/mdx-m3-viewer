import Handler from './handler';
import common from './common';

const FileHandler = {
    get objectType() {
        return "filehandler"
    }
};

common.mix(FileHandler, Handler);

export default FileHandler;
