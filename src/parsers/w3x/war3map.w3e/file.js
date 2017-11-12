import BinaryStream from '../../../common/binarystream';
// NOTE: Requires HTMLCanvasElement, and thuse a browser environment. Can anything be done to make this work in Node?
import { resizeImageData } from '../../../common/canvas';
import TilePoint from './tilepoint';

/**
 * @constructor
 * @param {ArrayBuffer} buffer
 */
function War3MapW3e(buffer) {
    this.version = 0;
    this.tileset = '';
    this.haveCustomTileset = 0;
    this.groundTilesets = [];
    this.cliffTilesets = [];
    this.mapSize = new Int32Array(2);
    this.centerOffset = new Float32Array(2);
    this.tilepoints = [];

    if (buffer instanceof ArrayBuffer) {
        this.load(buffer);
    }
}

War3MapW3e.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        if (stream.read(4) !== 'W3E!') {
            return false;
        }

        this.version = stream.readInt32();
        this.tileset = stream.read(1);
        this.haveCustomTileset = stream.readInt32();
    
        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.groundTilesets[i] = stream.read(4);
        }
    
        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.cliffTilesets[i] = stream.read(4);
        }
    
        this.mapSize = stream.readInt32Array(2);
        this.centerOffset = stream.readFloat32Array(2);
    
        let mapSize = this.mapSize,
            columns = mapSize[0],
            rows = mapSize[1];

        for (let row = 0; row < rows; row++) {
            this.tilepoints[row] = [];
    
            for (let column = 0; column < columns; column++) {
                this.tilepoints[row][column] = new TilePoint(stream);
            }
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.write('W3E!');
        stream.writeInt32(this.version);
        stream.write(this.tileset);
        stream.writeInt32(this.haveCustomTileset);
        stream.writeUint32(this.groundTilesets.length);

        for (let groundTileset of this.groundTilesets) {
            stream.write(groundTileset);
        }

        stream.writeUint32(this.cliffTilesets.length);
        
        for (let cliffTileset of this.cliffTilesets) {
            stream.write(cliffTileset);
        }

        stream.writeInt32Array(this.mapSize);
        stream.writeFloat32Array(this.centerOffset);

        for (let row of this.tilepoints) {
            for (let tilepoint of row) {
                tilepoint.save(stream);
            }
        }

        return buffer;
    },

    calcSize() {
        return 37 + (this.groundTilesets.length * 4) + (this.cliffTilesets.length * 4) + (this.mapSize[0] * this.mapSize[1] * 7);
    },

    applyHeightMap(imageData, scale) {
        let mapSize = this.mapSize,
            columns = mapSize[0],
            rows = mapSize[1];
        
        imageData = resizeImageData(imageData, columns, rows);

        let tilepoints = this.tilepoints,
            data = imageData.data;

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                // 0x2000 is the 0 height of Warcraft 3.
                tilepoints[row][column].groundHeight = 0x2000 + Math.floor(data[row * columns * 4 + column * 4] * scale);
            }
        }
    }
};

export default War3MapW3e;
