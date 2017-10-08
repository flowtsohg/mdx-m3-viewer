import W3xParserTilePoint from './tilepoint';

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xParserEnvironment(reader) {
    this.id = reader.read(4);
    this.version = reader.readInt32();
    this.tileset = reader.read(1);
    this.haveCustomTileset = reader.readInt32();

    this.groundTilesets = [];

    for (let i = 0, l = reader.readInt32(); i < l; i++) {
        this.groundTilesets[i] = reader.read(4);
    }

    this.cliffTilesets = [];

    for (let i = 0, l = reader.readInt32(); i < l; i++) {
        this.cliffTilesets[i] = reader.read(4);
    }

    this.mapSize = reader.readInt32Array(2);
    this.centerOffset = reader.readFloat32Array(2);

    this.tilepoints = [];

    for (let y = 0; y < this.mapSize[1]; y++) {
        this.tilepoints[y] = [];

        for (let x = 0; x < this.mapSize[0]; x++) {
            this.tilepoints[y][x] = new W3xParserTilePoint(reader);
        }
    }
}

export default W3xParserEnvironment;
