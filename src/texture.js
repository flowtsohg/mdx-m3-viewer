import { mix, resizeImageData } from "./common";
import DownloadableResource from "./downloadableresource";

/**
 * @constructor
 * @mixes DownloadableResource
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function Texture(env, pathSolver, handler, extension) {
    DownloadableResource.call(this, env, pathSolver, handler, extension);

    this.width = 0;
    this.height = 0;
}

Texture.prototype = {
    get objectType() {
        return "texture";
    },

    /**
     * Set the WebGL wrap and filter values.
     * 
     * @param {number} wrapS Wrap on the S axis.
     * @param {number} wrapT Wrap on the T axis.
     * @param {number} magFilter Maginfying filter.
     * @param {number} minFilter Minifying filter.
     */
    setParameters(wrapS, wrapT, magFilter, minFilter) {
        const gl = this.env.gl;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    },

    // Upscale the ImageData object to power-of-two if required.
    // This is a WebGL requierment for textures that use mipmapping or a repeating wrap mode.
    upscaleNPOT(imageData) {
        let width = imageData.width,
            height = imageData.height,
            potWidth = Math.powerOfTwo(width),
            potHeight = Math.powerOfTwo(height);

        if (width !== potWidth || height !== potHeight) {
            console.warn("Resizing texture \"" + this.fetchUrl + "\" from [" + width + ", " + height + "] to [" + potWidth + ", " + potHeight + "]");

            return resizeImageData(imageData, potWidth, potHeight);
        }

        return imageData;
    }
};

mix(Texture.prototype, DownloadableResource.prototype);

export default Texture;
