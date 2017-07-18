import Texture from '../../src/texture';
import BinaryReader from '../../src/binaryreader';
import common from '../../src/common';

/**
 * @constructor
 * @extends Texture
 * @memberOf Bmp
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 */
function BmpTexture(env, pathSolver) {
    Texture.call(this, env, pathSolver);
}

BmpTexture.prototype = {
    initialize(src) {
        // Simple binary reader implementation, see src/binaryreader.
        let reader = new BinaryReader(src);

        // BMP magic identifier
        if (reader.read(2) !== "BM") {
            this.onerror("InvalidSource", "WrongMagicNumber");
            return false;
        }

        reader.skip(8);

        const dataOffset = reader.readUint32();

        reader.skip(4);

        const width = reader.readUint32();
        const height = reader.readUint32();

        reader.skip(2);

        const bpp = reader.readUint16();

        if (bpp !== 24) {
            this.onerror("UnsupportedFeature", "BPP");
            return false;
        }

        const compression = reader.readUint32();

        if (compression !== 0) {
            this.onerror("UnsupportedFeature", "Compression");
            return false;
        }

        reader.seek(dataOffset);

        // Read width*height RGB pixels
        const data = reader.readUint8Array(width * height * 3);

        const gl = this.gl;

        const id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, id);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.webglResource = id; // If webglResource isn't set, this texture won't be bound to a texture unit

        // Report that this texture was loaded properly
        return true;
    }
};

common.mix(BmpTexture.prototype, Texture.prototype);

export default BmpTexture;
