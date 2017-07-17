import Handler from './handler';

const FileHandler = {
    get objectType() {
        return "filehandler"
    }
};

require('./common').mix(FileHandler, Handler);

export default FileHandler;
