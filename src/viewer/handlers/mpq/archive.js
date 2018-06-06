import MpqParserArchive from '../../../parsers/mpq/archive';
import Resource from '../../resource';

/**
 * A MPQ archive handler.
 */
export default class MpqArchive extends Resource {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    /** @member {?MpqParserArchive} */
    this.archive = null;
  }

  /**
   * @param {ArrayBuffer} src
   */
  load(src) {
    let archive = new MpqParserArchive(null, true);

    if (!archive.load(src)) {
      throw new Error('Failed to load archive');
    }

    this.archive = archive;
  }

  /**
   * Checks if a file exists in this archive.
   *
   * @param {string} name The file name to check
   * @return {boolean}
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
   * @return {MpqFile}
   */
  get(name) {
    return this.archive.get(name);
  }
}
