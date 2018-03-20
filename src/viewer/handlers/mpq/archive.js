import MpqParserArchive from '../../../parsers/mpq/archive';
import ViewerFile from '../../file';

export default class MpqArchive extends ViewerFile {
    /**
     * @param {ModelViewer} env
     * @param {function(?)} pathSolver
     * @param {Handler} handler
     * @param {string} extension
     */
    constructor(env, pathSolver, handler, extension) {
        super(env, pathSolver, handler, extension);

        /** @member {?MpqParserArchive} */
        this.archive = null;
    }

    initialize(src) {
        let archive = new MpqParserArchive(null, true);

        if (!archive.load(src)) {
            this.onerror('InvalidSource');
            return false;
        }

        this.archive = archive;

        return true;
    }

    /**
     * Checks if a file exists in this archive.
     * 
     * @param {string} name The file name to check
     * @returns {boolean}
     */
    has(name) {
        return this.archive.has(name);
    }

    /**
     * Extract a file from this archive.
     * Note that this is a lazy and cached operation. That is, files are only decoded from the archive on extraction, and the result is then cached.
     * Further requests to get the same file will get the cached result.
     * 
     * @param {string} name The file name to get
     * @returns {MpqFile}
     */
    get(name) {
        return this.archive.get(name);
    }
};
