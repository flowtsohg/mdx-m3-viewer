function AsyncTexture(source, fileType, options, handler, ctx, compressedTextures, isFromMemory) {
    this.type = "texture";
    this.source = source;
    this.fileType = fileType;
    this.options = options || {};
    this.handler = handler;
    this.id = generateID();
    this.compressedTextures = compressedTextures;
    this.ctx = ctx;
    this.ready = false;
    this.isFromMemory = isFromMemory;

    EventDispatcher.call(this);
}

AsyncTexture.prototype = {
    reportError: function (error) {
        this.dispatchEvent({ type: "error", error: error });
        this.dispatchEvent("loadend");
    },

    reportLoad: function () {
        this.dispatchEvent("load");
        this.dispatchEvent("loadend");

        this.ready = true;
    },

    loadstart: function () {
        this.dispatchEvent("loadstart");

        if (this.isFromMemory) {
            this.loadFromMemory(this.source);
        } else {
            this.request = getRequest(this.source, this.handler[1], this.onloadTexture.bind(this), this.error.bind(this), this.progress.bind(this));
        }
    },

    error: function (e) {
        this.dispatchEvent({ type: "error", error: e.target.status });
    },

    progress: function (e) {
        if (e.target.status === 200) {
            this.dispatchEvent({ type: "progress", loaded: e.loaded, total: e.total, lengthComputable: e.lengthComputable });
        }
    },

    abort: function () {
        if (this.request && this.request.readyState !== XMLHttpRequest.DONE) {
            this.request.abort();

            this.dispatchEvent("abort");
        }
    },

    onloadTexture: function (e) {
        var target = e.target;
        
        if (target.status === 200) {
            this.loadFromMemory(target.response);
        } else {
            this.dispatchEvent({ type: "error", error: target.status });
            this.dispatchEvent("loadend");
        }
    },

    loadFromMemory: function (src) {
        this.texture = new this.handler[0]();
        this.texture.loadstart(this, src, this.reportError.bind(this), this.reportLoad.bind(this))
    },
    
    loaded: function () {
        if (this.request) {
            return (this.request.readyState === XMLHttpRequest.DONE);
        }
        
        return false;
    },

    update: function (src) {
        if (this.impl && this.impl.ready) {
            var ctx = this.ctx;

            ctx.bindTexture(ctx.TEXTURE_2D, this.impl.id);
            //ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, src);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src);
        }
    }
};

mixin(EventDispatcher.prototype, AsyncTexture.prototype);
