import Texture from '../../texture';
import Parser from '../../../parsers/blp/texture';

export default class BlpTexture extends Texture {
    initialize(src) {
        let texture = new Parser();

        try {
            texture.load(src);
        } catch (e) {
            this.onerror('InvalidSource', e);
            return false;
        }

        let gl = this.env.gl;

        // Upscale to POT if the size is NPOT.
        let imageData = this.upscaleNPOT(texture.getMipmap(0));

        // NOTE: BGRA data, it gets sizzled in the shader.
        //       I feel like the noticeable slow down when sizzling once on the client side isn't worth it.
        let id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, id);
        this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.texture = texture;
        this.imageData = imageData;
        this.width = imageData.width; // Note: might not be the same as 'width' and 'height' due to NPOT upscaling.
        this.height = imageData.height;
        this.webglResource = id;

        return true;
    }
};
