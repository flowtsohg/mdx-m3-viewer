import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * A helper.
 */
export default class Helper extends GenericObject {
  readMdl(stream: TokenStream): void {
    for (const token of super.readGenericBlock(stream)) {
      throw new Error(`Unknown token in Helper: "${token}"`);
    }
  }

  writeMdl(stream: TokenStream): void {
    stream.startObjectBlock('Helper', this.name);
    this.writeGenericHeader(stream);
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
}
