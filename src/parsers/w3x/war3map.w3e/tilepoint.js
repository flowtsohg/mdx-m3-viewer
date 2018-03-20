export default class TilePoint {
    constructor() {
        /** @member {number} */
        this.groundHeight = 0;
        /** @member {number} */
        this.waterLevel = 0;
        /** @member {number} */
        this.flags = 0;
        /** @member {number} */
        this.groundTextureType = 0;
        /** @member {number} */
        this.cliffVariation = 0;
        /** @member {number} */
        this.variation = 0;
        /** @member {number} */
        this.cliffTextureType = 0;
        /** @member {number} */
        this.layerHeight = 0;
    }

    /**
     * @param {BinaryStream} stream 
     */
    load(stream) {
        let value;

        this.groundHeight = stream.readInt16();
        this.waterLevel = stream.readInt16();
    
        // bits: 4 4
        value = stream.readUint8();

        this.flags = value >>> 4;
        this.groundTextureType = value & 0xF;

        // bits: 3 5
        value = stream.readUint8();

        this.cliffVariation = value >>> 5;
        this.variation = value & 0x1F;
    
        // bits: 4 4
        value = stream.readUint8();

        this.cliffTextureType = value >>> 4;
        this.layerHeight = value & 0xF;
    }

    /**
     * @param {BinaryStream} stream 
     */
    save(stream) {
        stream.writeInt16(this.groundHeight);
        stream.writeInt16(this.waterLevel);
        stream.writeUint8((this.flags << 4) | this.groundTextureType);
        stream.writeUint8((this.cliffVariation << 5) | this.variation);
        stream.writeUint8((this.cliffTextureType << 4) | this.layerHeight);
    }
};
