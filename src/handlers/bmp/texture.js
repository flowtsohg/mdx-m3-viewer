import { mix, resizeImageData } from "../../common";
import Texture from "../../texture";
import BinaryReader from "../../binaryreader";

/**
 * @constructor
 * @extends Texture
 * @memberOf Bmp
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function BmpTexture(env, pathSolver, handler, extension) {
    Texture.call(this, env, pathSolver, handler, extension);
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

        let dataOffset = reader.readUint32();

        reader.skip(4);

        let width = reader.readUint32();
        let height = reader.readUint32();

        reader.skip(2);

        let bpp = reader.readUint16();

        if (bpp !== 24) {
            this.onerror("UnsupportedFeature", "BPP");
            return false;
        }

        let compression = reader.readUint32();

        if (compression !== 0) {
            this.onerror("UnsupportedFeature", "Compression");
            return false;
        }

        reader.seek(dataOffset);

        // Read width*height RGB pixels
        let imageData = new ImageData(width, height),
            data = imageData.data;

        for (let i = 0, l = width * height, base = 0; i < l; i += 1, base += 4) {
            let rgb = reader.readUint8Array(3);

            data[base] = rgb[0];
            data[base + 1] = rgb[1];
            data[base + 2] = rgb[2];
            data[base + 3] = 255;
        }

        // In case the dimensions aren't power of two, resize the image data. This is required for proper WebGL behavior.
        let potWidth = Math.powerOfTwo(width),
            potHeight = Math.powerOfTwo(height);

        if (width !== potWidth || height !== potHeight) {
            console.warn("Resizing texture \"" + this.fetchUrl + "\" from [" + width + ", " + height + "] to [" + potWidth + ", " + potHeight + "]");

            width = potWidth;
            height = potHeight;

            imageData = resizeImageData(imageData, potWidth, potHeight);
        }

        // Finally, create the actual WebGL texture.
        let gl = this.gl;
        let id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, id);
        this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.imageData = imageData;
        this.width = width;
        this.height = height;
        this.webglResource = id; // If webglResource isn't set, this texture won't be bound to a texture unit

        // Report that this texture was loaded properly
        return true;
    }
};

mix(BmpTexture.prototype, Texture.prototype);

export default BmpTexture;
