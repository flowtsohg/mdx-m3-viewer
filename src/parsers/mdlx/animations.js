import { UintTrack, FloatTrack, Vector3Track, Vector4Track } from './tracks';

class Animation {
    constructor() {
        /** @member {string} */
        this.name = '';
        /** @member {number} */
        this.interpolationType = 0;
        /** @member {number} */
        this.globalSequenceId = -1;
        /** @member {Array<Track>} */
        this.tracks = [];
    }

    readMdx(stream, name) {
        this.name = name;

        let tracksCount = stream.readUint32();

        this.interpolationType = stream.readUint32();
        this.globalSequenceId = stream.readInt32();

        for (let i = 0; i < tracksCount; i++) {
            let track = this.newTrack();

            track.readMdx(stream, this.interpolationType);

            this.tracks.push(track);
        }
    }

    writeMdx(stream) {
        stream.write(this.name);
        stream.writeUint32(this.tracks.length);
        stream.writeUint32(this.interpolationType);
        stream.writeInt32(this.globalSequenceId);

        for (let track of this.tracks) {
            track.writeMdx(stream, this.interpolationType);
        }
    }

    readMdl(stream, name) {
        this.name = name;

        let numberOfTracks = stream.readInt();

        stream.read(); // {

        let token = stream.read(),
            interpolationType = 0;

        if (token === 'DontInterp') {
            interpolationType = 0;
        } else if (token === 'Linear') {
            interpolationType = 1;
        } else if (token === 'Hermite') {
            interpolationType = 2;
        } else if (token === 'Bezier') {
            interpolationType = 3;
        }

        this.interpolationType = interpolationType;

        // GlobalSeqId only exists if it's not -1.
        if (stream.peek() === 'GlobalSeqId') {
            stream.read();

            this.globalSequenceId = stream.readInt();
        }

        for (let i = 0; i < numberOfTracks; i++) {
            let track = this.newTrack();

            track.readMdl(stream, interpolationType);

            this.tracks[i] = track;
        }

        stream.read(); // }
    }

    writeMdl(stream, name) {
        stream.startBlock(name, this.tracks.length);

        let token;

        if (this.interpolationType === 0) {
            token = 'DontInterp';
        } else if (this.interpolationType === 1) {
            token = 'Linear';
        } else if (this.interpolationType === 2) {
            token = 'Hermite';
        } else if (this.interpolationType === 3) {
            token = 'Bezier';
        }

        stream.writeFlag(token);

        if (this.globalSequenceId !== -1) {
            stream.writeAttrib('GlobalSeqId', this.globalSequenceId);
        }

        for (let track of this.tracks) {
            track.writeMdl(stream, this.interpolationType);
        }

        stream.endBlock();
    }

    getByteLength() {
        return 16 + this.tracks.length * (4 + 4 * this.valueLength() * (this.interpolationType > 1 ? 3 : 1));
    }
}

export class UintAnimation extends Animation {
    newTrack() {
        return new UintTrack();
    }

    valueLength() {
        return 1;
    }
};

export class FloatAnimation extends Animation {
    newTrack() {
        return new FloatTrack();
    }

    valueLength() {
        return 1;
    }
};

export class Vector3Animation extends Animation {
    newTrack() {
        return new Vector3Track();
    }

    valueLength() {
        return 3;
    }
};

export class Vector4Animation extends Animation {
    newTrack() {
        return new Vector4Track();
    }

    valueLength() {
        return 4;
    }
};
