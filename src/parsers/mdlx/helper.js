import GenericObject from './genericobject';

/**
 * A helper.
 */
export default class Helper extends GenericObject {
  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (let token of super.readMdl(stream)) {
      throw new Error(`Unknown token in Helper: "${token}"`);
    }
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startObjectBlock('Helper', this.name);
    this.writeGenericHeader(stream);
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
}
