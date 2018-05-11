import { imageToImageData, scaleNPOT } from '../../../common/canvas';
import Texture from '../../texture';

export default class ImageTexture extends Texture {
    load(src) {
        // src can either be an Image, or an ArrayBuffer, depending on the way it was loaded
        if (src instanceof HTMLImageElement || src instanceof HTMLVideoElement || src instanceof HTMLCanvasElement || src instanceof ImageData) {
            this.loadFromImage(src);
        } else if (src instanceof WebGLTexture) {
            this.webglResource = src;
        }
    }

    loadFromImage(imageData) {
        let gl = this.viewer.gl;

        if (!(imageData instanceof ImageData)) {
            imageData = imageToImageData(imageData);
        }

        // Upscale to POT if the size is NPOT.
        imageData = scaleNPOT(imageData);

        let id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, id);
        this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.imageData = imageData;
        this.width = imageData.width; // Note: might not be the same as 'image.width' and 'image.height' due to NPOT upscaling.
        this.height = imageData.height;
        this.webglResource = id;
    }
};
