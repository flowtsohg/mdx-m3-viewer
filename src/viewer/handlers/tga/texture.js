import Texture from '../../texture';

export default class TgaTexture extends Texture {
    initialize(src) {
        let gl = this.env.gl,
            dataView = new DataView(src),
            imageType = dataView.getUint8(2);

        if (imageType !== 2) {
            this.onerror('UnsupportedFeature', 'ImageType');
            return false;
        }

        let width = dataView.getUint16(12, true),
            height = dataView.getUint16(14, true),
            pixelDepth = dataView.getUint8(16),
            imageDescriptor = dataView.getUint8(17);

        if (pixelDepth !== 32) {
            this.onerror('UnsupportedFeature', 'BPP');
            return false;
        }

        // Upscale to POT if the size is NPOT.
        let imageData = this.upscaleNPOT(new ImageData(new Uint8ClampedArray(src, 18, width * height * 4), width, height));

        let id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, id);
        this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.imageData = imageData;
        this.width = imageData.width; // Note: might not be the same as 'width' and 'height' due to NPOT upscaling.
        this.height = imageData.height;
        this.webglResource = id;

        return true;
    }
};
