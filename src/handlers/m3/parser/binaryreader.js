import mix from "../../../mix";
import BinaryReader from "../../../binaryreader";

/**
 * @constructor
 * @extends {BinaryReader}
 * @param {ArrayBuffer} buffer
 * @param {number=} byteOffset
 * @param {number=} byteLength
 */
function M3ParserBinaryReader(buffer, byteOffset, byteLength) {
    BinaryReader.call(this, buffer, byteOffset, byteLength);
}

M3ParserBinaryReader.prototype = {
    /**
     * Peek a character array.
     * 
     * @param {number} size
     * @returns {Array<string>}
     */
    peekCharArray(size) {
        let uint8array = this.byteArray,
            index = this.index,
            data = [];

        for (let i = 0; i < size; i++) {
            data[i] = String.fromCharCode(uint8array[index + i]);
        }

        return data;
    },

    /**
     * Read a character array.
     * 
     * @param {number} size
     * @returns {Array<string>}
     */
    readCharArray(size) {
        // If the size isn't specified, default to everything
        size = size || (this.byteLength - this.index);

        let data = this.peekCharArray(size);

        this.index += size;

        return data;
    }
};

mix(M3ParserBinaryReader.prototype, BinaryReader.prototype);

export default M3ParserBinaryReader;
