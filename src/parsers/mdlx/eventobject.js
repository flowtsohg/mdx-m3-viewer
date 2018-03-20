import GenericObject from './genericobject';

export default class EventObject extends GenericObject {
    constructor() {
        super();

        /** @member {number} */
        this.globalSequenceId = -1;
        /** @member {Uint32Array} */
        this.tracks = new Uint32Array(1);
    }

    readMdx(stream) {
        super.readMdx(stream);

        stream.skip(4); // KEVT

        let count = stream.readUint32();

        this.globalSequenceId = stream.readUint32();
        this.tracks = stream.readUint32Array(count);
    }

    writeMdx(stream) {
        super.writeMdx(stream);
        stream.write('KEVT');
        stream.writeUint32(this.tracks.length);
        stream.writeUint32(this.globalSequenceId);
        stream.writeUint32Array(this.tracks);
    }

    readMdl(stream) {
        for (let token of super.readMdl(stream)) {
            if (token === 'EventTrack') {
                this.tracks = stream.readIntArray(new Uint32Array(stream.readInt()));
            } else {
                throw new Error(`Unknown token in EventObject: "${token}"`);
            }
        }
    }

    writeMdl(stream) {
        stream.startObjectBlock('EventObject', this.name);
        this.writeGenericHeader(stream);
        
        stream.startBlock('EventTrack', this.tracks.length);

        for (let track of this.tracks) {
            stream.writeFlag(track);
        }

        stream.endBlock();

        this.writeGenericAnimations(stream);
        stream.endBlock();
    }

    getByteLength() {
        return 12 + this.tracks.byteLength + super.getByteLength();
    }
};
