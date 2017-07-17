const FileHandler = require('../../src/filehandler');

const Slk = {
    get extension() {
        return ".slk";
    },

    get Constructor() {
        return SlkFile;
    }
};

require('../../src/common').mix(Slk, FileHandler);

module.exports = Slk;
