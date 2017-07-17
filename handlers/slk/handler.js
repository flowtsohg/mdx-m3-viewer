import FileHandler from '../../src/filehandler';

const Slk = {
    get extension() {
        return ".slk";
    },

    get Constructor() {
        return SlkFile;
    }
};

require('../../src/common').mix(Slk, FileHandler);

export default Slk;
