import ViewerFile from '../../file';
import SlkParser from '../../../parsers/slk/file';

export default class SlkFile extends ViewerFile {
    /**
     * @param {ModelViewer} env
     * @param {function(?)} pathSolver
     * @param {Handler} handler
     * @param {string} extension
     */
    constructor(env, pathSolver, handler, extension) {
        super(env, pathSolver, handler, extension);

        this.file = null;
    }

    initialize(src) {
        try {
            this.file = new SlkParser(src);
        } catch (e) {
            this.onerror('InvalidSource', 'WrongMagicNumber');
            return false;
        }

        return true;
    }

    getRow(key) {
        return this.file.getRowByKey(key);
    }
};
