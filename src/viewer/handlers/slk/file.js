import mix from '../../../common/mix';
import ViewerFile from '../../file';
import SlkFile from '../../../parsers/slk/file';

/**
 * @constructor
 * @augments ViewerFile
 * @memberOf Slk
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function File(env, pathSolver, handler, extension) {
    ViewerFile.call(this, env, pathSolver, handler, extension);

    this.file = null;
}

File.prototype = {
    initialize(src) {
        try {
            this.file = new SlkFile(src);
        } catch (e) {
            this.onerror('InvalidSource', 'WrongMagicNumber');
            return false;
        }

        return true;
    },

    getRow(key) {
        return this.file.getRowByKey(key);
    }
};

mix(File.prototype, ViewerFile.prototype);

export default File;
