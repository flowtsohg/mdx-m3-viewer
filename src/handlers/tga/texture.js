import { mix, resizeImageData } from "../../common";
import Texture from "../../texture";

/**
 * @constructor
 * @augments Texture
 * @memberOf Tga
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function TgaTexture(env, pathSolver, handler, extension) {
    Texture.call(this, env, pathSolver, handler, extension);
}

TgaTexture.prototype = {
    initialize(src) {
        let gl = this.env.gl,
            dataView = new DataView(src),
            imageType = dataView.getUint8(2);

        if (imageType !== 2) {
            this.onerror("UnsupportedFeature", "ImageType");
            return false;
        }

        let width = dataView.getUint16(12, true),
            height = dataView.getUint16(14, true),
            pixelDepth = dataView.getUint8(16),
            imageDescriptor = dataView.getUint8(17);

        if (pixelDepth !== 32) {
            this.onerror("UnsupportedFeature", "BPP");
            return false;
        }

        let imageData = new ImageData(new Uint8ClampedArray(src, 18, width * height * 4), width, height);

        let potWidth = Math.powerOfTwo(width),
            potHeight = Math.powerOfTwo(height);

        if (width !== potWidth || height !== potHeight) {
            console.warn("Resizing texture \"" + this.fetchUrl + "\" from [" + width + ", " + height + "] to [" + potWidth + ", " + potHeight + "]");

            width = potWidth;
            height = potHeight;

            imageData = resizeImageData(imageData, potWidth, potHeight);
        }

        let id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, id);
        this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.imageData = imageData;
        this.width = width;
        this.height = height;
        this.webglResource = id;

        return true;
    }
};

mix(TgaTexture.prototype, Texture.prototype);

export default TgaTexture;
