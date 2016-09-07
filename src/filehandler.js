const FileHandler = {
    get objectType() {
        return "filehandler"
    },

    get File() {
        throw "FileHandler.File must be overriden!";
    }
};

mix(FileHandler, Handler);
