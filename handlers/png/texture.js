// While this texture is called Png, this class is actually used for all browser native formats (.png, .jpg, .gif)
function PngTexture(env, pathSolver) {
    Texture.call(this, env, pathSolver);
}

PngTexture.prototype = {
    get Handler() {
        return Png;
    },

    initialize(src) {
        let gl = this.env.gl;

        // src can either be an Image, or an ArrayBuffer, depending on the way it was loaded
        if (src instanceof HTMLImageElement || src instanceof HTMLVideoElement || src instanceof HTMLCanvasElement || src instanceof ImageData) {
            let id = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, id);
            this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
            gl.generateMipmap(gl.TEXTURE_2D);

            this.width = src.width;
            this.height = src.height;
            this.webglResource = id;

            return true;
        } else {
            var blob = new Blob([src]),
                url = URL.createObjectURL(blob),
                image = new Image();

            image.onload = _ => {
                let id = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, id);
                this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);

                this.width = image.width;
                this.height = image.height;
                this.webglResource = id;

                this.finalizeLoad();
            };

            image.src = url;
        }
    }
};

mix(PngTexture.prototype, Texture.prototype);
