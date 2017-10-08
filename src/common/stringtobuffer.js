import BinaryWriter from '../binarywriter';

export default function stringToBuffer(s) {
    let writer = new BinaryWriter(new ArrayBuffer(s.length));

    writer.write(s);

    return writer.buffer;
};
