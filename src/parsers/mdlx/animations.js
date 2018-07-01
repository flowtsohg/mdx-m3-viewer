import {UintTrack, FloatTrack, Vector3Track, Vector4Track} from './tracks';

/**
 * A templated animation.
 *
 * @param {UintTrack|FloatTrack|Vector3Track|Vector4Track} TrackType
 * @return {class}
 */
const templatedAnimation = (TrackType) => class {
  /**
   *
   */
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

  /**
   * @param {BinaryStream} stream
   * @param {string} name
   */
  readMdx(stream, name) {
    this.name = name;

    const tracksCount = stream.readUint32();

    this.interpolationType = stream.readUint32();
    this.globalSequenceId = stream.readInt32();

    for (let i = 0; i < tracksCount; i++) {
      const track = new TrackType();

      track.readMdx(stream, this.interpolationType);

      this.tracks.push(track);
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.write(this.name);
    stream.writeUint32(this.tracks.length);
    stream.writeUint32(this.interpolationType);
    stream.writeInt32(this.globalSequenceId);

    for (const track of this.tracks) {
      track.writeMdx(stream, this.interpolationType);
    }
  }

  /**
   * @param {TokenStream} stream
   * @param {string} name
   */
  readMdl(stream, name) {
    this.name = name;

    const numberOfTracks = stream.readInt();

    stream.read(); // {

    const token = stream.read();

    if (token === 'DontInterp') {
      this.interpolationType = 0;
    } else if (token === 'Linear') {
      this.interpolationType = 1;
    } else if (token === 'Hermite') {
      this.interpolationType = 2;
    } else if (token === 'Bezier') {
      this.interpolationType = 3;
    }

    // GlobalSeqId only exists if it's not -1.
    if (stream.peek() === 'GlobalSeqId') {
      stream.read();

      this.globalSequenceId = stream.readInt();
    }

    for (let i = 0; i < numberOfTracks; i++) {
      const track = new TrackType();

      track.readMdl(stream, this.interpolationType);

      this.tracks[i] = track;
    }

    stream.read(); // }
  }

  /**
   * @param {TokenStream} stream
   * @param {string} name
   */
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

    for (const track of this.tracks) {
      track.writeMdl(stream, this.interpolationType);
    }

    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let tracks = this.tracks;
    let size = 16;

    if (tracks.length) {
      size += tracks[0].getByteLength(this.interpolationType) * tracks.length;
    }

    return size;
  }
};

/**
 * A uint animation.
 */
export const UintAnimation = templatedAnimation(UintTrack);

/**
 * A float animation
 */
export const FloatAnimation = templatedAnimation(FloatTrack);

/**
 * A vector 3 animation.
 */
export const Vector3Animation = templatedAnimation(Vector3Track);

/**
 * A vector 4 animation.
 */
export const Vector4Animation = templatedAnimation(Vector4Track);
