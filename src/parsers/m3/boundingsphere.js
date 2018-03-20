export default class M3ParserBoundingSphere {
    /**
     * @param {BinaryReader} reader
     */
    constructor(reader) {
        /** @member {Float32Array} */
        this.min = reader.readFloat32Array(3);
        /** @member {Float32Array} */
        this.max = reader.readFloat32Array(3);
        /** @member {number} */
        this.radius = reader.readFloat32();
    }
};
