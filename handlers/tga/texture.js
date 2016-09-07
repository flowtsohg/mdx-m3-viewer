function TgaTexture(env, pathSolver) {
    Texture.call(this, env, pathSolver);
}

TgaTexture.prototype = {
    get Handler() {
        return Tga;
    },

    initialize(src) {
        const gl = this.env.gl,
            dataView = new DataView(src),
            imageType = dataView.getUint8(2);

        if (imageType !== 2) {
            this.onerror("ImageType");
            return false;
        }

        let width = dataView.getUint16(12, true),
            height = dataView.getUint16(14, true),
            pixelDepth = dataView.getUint8(16),
            imageDescriptor = dataView.getUint8(17);

        if (pixelDepth !== 32) {
            this.onerror("PixelDepth");
            return false;
        }

        let id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, id);
        this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(src, 18, width * height * 4));
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.width = width;
        this.height = height;
        this.webglResource = id;

        return true;
    }
};

mix(TgaTexture.prototype, Texture.prototype);
