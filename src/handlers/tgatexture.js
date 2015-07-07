/**
 * @class A TGA texture decoder. Supports only simple 32bit TGA images.
 * @name TGATexture
 * @param {ArrayBuffer} arrayBuffer The raw texture data.
 * @param {object} options An object containing options.
 * @param {WebGLRenderingContext} ctx A WebGL context.
 * @param {function} onerror A function that allows to report errors.
 * @param {function} onload A function that allows to manually report a success at parsing.
 * @property {WebGLTexture} id
 * @property {boolean} ready
 */

window["TGATexture"] = function TGATexture(arrayBuffer, options, ctx, onerror, onload, compressedTextures) {
    var dataView = new DataView(arrayBuffer);
    var imageType = dataView.getUint8(2);

    if (imageType !== 2) {
        onerror("TGA: ImageType");
        return;
    }

    var width = dataView.getUint16(12, true);
    var height = dataView.getUint16(14, true);
    var pixelDepth = dataView.getUint8(16);
    var imageDescriptor = dataView.getUint8(17);

    if (pixelDepth !== 32) {
        onerror("TGA: PixelDepth");
        return;
    }

    var rgba8888Data = new Uint8Array(arrayBuffer, 18, width * height * 4);
    var index;
    var temp;
    var i;
    var l;
    
    // BGRA -> RGBA
    //~ for (i = 0, l = width * height; i < l; i++) {
        //~ index = i * 4;
        //~ temp = rgba8888Data[index];

        //~ rgba8888Data[index] = rgba8888Data[index + 2];
        //~ rgba8888Data[index + 2] = temp;
    //~ }

    var id = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, id);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, options.clampS ? ctx.CLAMP_TO_EDGE : ctx.REPEAT);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, options.clampT ? ctx.CLAMP_TO_EDGE : ctx.REPEAT);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
    ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 1);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, width, height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, rgba8888Data);
    ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 0);
    ctx.generateMipmap(ctx.TEXTURE_2D);

    this.id = id;
    this.ready = true;
    
    onload();
};
