import mix from '../../mix';
import ViewerFile from '../../file';
import MpqParserArchive from './parser/archive';

/**
 * @constructor
 * @augments ViewerFile
 * @memberOf Mpq
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function MpqArchive(env, pathSolver, handler, extension) {
    ViewerFile.call(this, env, pathSolver, handler, extension);

    /** @member {?MpqParserArchive} */
    this.archive = null;
}

MpqArchive.prototype = {
    initialize(src) {
        try {
            this.archive = new MpqParserArchive(src, true);
        } catch (e) {
            this.onerror('InvalidSource', e);
            return false;
        }

        return true;
    },

    /**
     * Checks if a file exists in this archive.
     * 
     * @param {string} name The file name to check
     * @returns {boolean}
     */
    has(name) {
        return this.archive.has(name);
    },

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

mix(MpqArchive.prototype, ViewerFile.prototype);

export default MpqArchive;
