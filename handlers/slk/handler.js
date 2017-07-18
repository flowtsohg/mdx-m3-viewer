import FileHandler from '../../src/filehandler';
import common from '../../src/common';

const Slk = {
    get extension() {
        return ".slk";
    },

    get Constructor() {
        return SlkFile;
    }
};

common.mix(Slk, FileHandler);

export default Slk;
