const Handler = require('./handler');

const FileHandler = {
    get objectType() {
        return "filehandler"
    }
};

require('./common').mix(FileHandler, Handler);

module.exports = FileHandler;
