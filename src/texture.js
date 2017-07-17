const DownloadableResource = require('./downloadableresource');

/**
 * @constructor
 * @mixes DownloadableResource
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 */
function Texture(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);
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
    }
};

require('./common').mix(Texture.prototype, DownloadableResource.prototype);

module.exports = Texture;
