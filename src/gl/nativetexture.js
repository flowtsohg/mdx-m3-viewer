/**
 * A texture.
 * 
 * @memberof GL
 * @class A wrapper around native images.
 * @name NativeTexture
 * @param {ArrayBuffer} arrayBuffer The raw texture data.
 * @param {object} options An object containing options.
 * @param {WebGLRenderingContext} ctx A WebGL context.
 * @param {function} onerror A function that allows to report errors.
 * @param {function} onload A function that allows to manually report a success at parsing.
 * @property {WebGLTexture} id
 * @property {boolean} ready
 */
function NativeTexture(arrayBuffer, options, ctx, onerror, onload, compressedTextures) {
    var blob = new Blob([arrayBuffer]),
        url = URL.createObjectURL(blob),
        image = new Image(),
        self = this;

    image.onload = function (e) {
        var id = ctx.createTexture();

        ctx.bindTexture(ctx.TEXTURE_2D, id);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
        ctx.generateMipmap(ctx.TEXTURE_2D);

        self.id = id;
        self.ready = true;

        onload();
    };

    image.src = url;
}
