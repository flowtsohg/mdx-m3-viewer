/**
 * @constructor
 * @param {W3xParserTilePoint} tilepoint
 */
function W3xTilePoint(tilepoint) {
    this.groundHeight = tilepoint.groundHeight;
    this.waterLevel = tilepoint.waterLevel;
    this.groundTextureType = tilepoint.groundTextureType;
    this.ramp = tilepoint.ramp;
    this.blight = tilepoint.blight;
    this.water = tilepoint.water;
    this.variation = tilepoint.variation;
    this.cliffVariation = tilepoint.cliffVariation;
    this.cliffTextureType = tilepoint.cliffTextureType;
    this.layerHeight = tilepoint.layerHeight;
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
