/**
 * @class
 * @classdesc A base class for all textures.
 * @extends DownloadableResource
 * @param {ModelViewer} env The model viewer object that this model belongs to.
 * @param {function} pathSolver A function that solves paths. See more {@link PathSolver here}.
 */
function Texture(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);
}

Texture.prototype = {
    get objectType() {
        return "texture";
    },

    setParameters(wrapS, wrapT, magFilter, minFilter) {
        const gl = this.env.gl;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    }
};

mix(Texture.prototype, DownloadableResource.prototype);
