import GenericObject from './genericobject';

export default class Helper extends GenericObject {
    readMdl(stream) {
        for (let token of super.readMdl(stream)) {
            throw new Error(`Unknown token in Helper: "${token}"`);
        }
    }

    writeMdl(stream) {
        stream.startObjectBlock('Helper', this.name);
        this.writeGenericHeader(stream);
        this.writeGenericAnimations(stream);
        stream.endBlock();
    }
};
