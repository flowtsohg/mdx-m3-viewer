// Note: This file is largely based on https://github.com/toji/webctx-texture-utils/blob/master/texture-util/dds.js

function DdsTexture(env, pathSolver) {
    Texture.call(this, env, pathSolver);
}

DdsTexture.prototype = {
    get Handler() {
        return Dds;
    },

    initialize(src) {
        const gl = this.env.gl,
            compressedTextures = this.env.webgl.extensions.compressedTextureS3tc,
            DDS_MAGIC = 0x20534444,
            DDSD_MIPMAPCOUNT = 0x20000,
            DDPF_FOURCC = 0x4,
            FOURCC_DXT1 = 0x31545844,
            FOURCC_DXT3 = 0x33545844,
            FOURCC_DXT5 = 0x35545844,
            header = new Int32Array(src, 0, 31);

        if (header[0] !== DDS_MAGIC) {
            this.onerror("InvalidSource", "WrongMagicNumber");
            return false;
        }

        if (!header[20] & DDPF_FOURCC) {
            this.onerror("UnsupportedFeature", "FourCC");
            return false;
        }

        let fourCC = header[21],
            blockBytes,
            internalFormat;

        if (fourCC === FOURCC_DXT1) {
            blockBytes = 8;
            internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGBA_S3TC_DXT1_EXT : null;
        } else if (fourCC === FOURCC_DXT3) {
            blockBytes = 16;
            internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGBA_S3TC_DXT3_EXT : null;
        } else if (fourCC === FOURCC_DXT5) {
            blockBytes = 16;
            internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGBA_S3TC_DXT5_EXT : null;
        } else {
            this.onerror(UintToTag(fourCC))
            return false;
        }

        internalFormat = null;

        let mipmapCount = 1;

        if (header[2] & DDSD_MIPMAPCOUNT) {
            mipmapCount = Math.max(1, header[7]);
        }

        let width = header[4],
            height = header[3],
            dataOffset = header[1] + 4,
            dataLength,
            byteArray;

        const id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, id);
        this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, mipmapCount > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);

        if (internalFormat) {
            for (let i = 0; i < mipmapCount; i++) {
                dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes;
                byteArray = new Uint8Array(src, dataOffset, dataLength);
                gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, byteArray);
                dataOffset += dataLength;
                width *= 0.5;
                height *= 0.5;
            }
        } else {
            dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes;
            byteArray = new Uint16Array(src, dataOffset);

            if (fourCC === FOURCC_DXT1) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_SHORT_5_6_5, dxt1ToRgb565(byteArray, width, height));
            } else if (fourCC === FOURCC_DXT3) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, dxt3ToRgba8888(byteArray, width, height));
            } else {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, dxt5ToRgba8888(byteArray, width, height));
            }

            gl.generateMipmap(gl.TEXTURE_2D);
        }

        this.width = width;
        this.height = height;
        this.webglResource = id;

        return true;
    }
};

mix(DdsTexture.prototype, Texture.prototype);
