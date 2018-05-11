import Resource from './resource';

export default class Texture extends Resource {
    /**
     * @param {Object} resourceData
     */
    constructor(resourceData) {
        super(resourceData);

        this.width = 0;
        this.height = 0;
    }

    /**
     * Set the WebGL wrap and filter values.
     * 
     * @param {number} wrapS Wrap on the S axis.
     * @param {number} wrapT Wrap on the T axis.
     * @param {number} magFilter Maginfying filter.
     * @param {number} minFilter Minifying filter.
     */
    setParameters(wrapS, wrapT, magFilter, minFilter) {
        const gl = this.viewer.gl;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    }
};
