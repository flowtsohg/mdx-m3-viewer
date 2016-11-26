const FileHandler = {
    get objectType() {
        return "filehandler"
    },

    get File() {
        throw new Error("FileHandler.File must be overriden!");
    }
};

mix(FileHandler, Handler);
