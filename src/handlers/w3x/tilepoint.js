/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xTilePoint(reader) {
    this.groundHeight = reader.readInt16();

    var short = reader.readInt16();

    this.waterLevel = short & 0x3FFF;
    this.mapEdge = short & 0xC000;

    var byte = reader.readInt8();

    this.groundTextureType = byte & 0x0F;

    var flags = byte & 0xF0;
    this.ramp = flags & 0x0010;
    this.blight = flags & 0x0020;
    this.water = flags & 0x0040;
    this.boundry = flags & 0x4000;
    
    byte = reader.readInt8();

    this.variation = byte & 31;

    // Values seen are 0, 1, and 2. What is this?
    this.whatIsThis = (byte & 224) >> 5;

    byte = reader.readInt8();

    this.cliffTextureType = (byte & 0xF0) >> 4;
    this.layerHeight = byte & 0x0F;
}

W3xTilePoint.prototype = {
    getWaterHeight() {
        return ((this.waterLevel - 0x2000 + (this.layerHeight - 2) * 0x0200) / 4) / 128;

    },

    getHeight() {
        return ((this.groundHeight - 0x2000 + (this.layerHeight - 2) * 0x0200) / 4) / 128;
    },

    getCliffHeight(cliffHeight) {
        return ((this.groundHeight - 0x2000 + (this.layerHeight - 2) * 0x0200) / 4 - cliffHeight * 128) / 128;
    }
};

export default W3xTilePoint;
