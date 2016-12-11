// A simple 24-bit BMP handler
function BmpTexture(env, pathSolver) {
    Texture.call(this, env, pathSolver);
}

BmpTexture.prototype = {
    get Handler() {
        return Bmp;
    },

    initialize(src) {
        // Simple binary reader implementation, see src/binaryreader.
        const binaryReader = new BinaryReader(src);

        // BMP magic identifier
        if (read(binaryReader, 2) !== "BM") {
            this.onerror("InvalidSource", "WrongMagicNumber");
            return false;
        }

        skip(binaryReader, 8);

        const dataOffset = readUint32(binaryReader);

        skip(binaryReader, 4);

        const width = readUint32(binaryReader);
        const height = readUint32(binaryReader);

        skip(binaryReader, 2);

        const bpp = readUint16(binaryReader);

        if (bpp !== 24) {
            this.onerror("UnsupportedFeature", "BPP");
            return false;
        }

        const compression = readUint32(binaryReader);

        if (compression !== 0) {
            this.onerror("UnsupportedFeature", "Compression");
            return false;
        }

        seek(binaryReader, dataOffset);

        // Read width*height RGB pixels
        const data = readUint8Array(binaryReader, width * height * 3);

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

mix(BmpTexture.prototype, Texture.prototype);
