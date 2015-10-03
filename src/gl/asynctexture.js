function AsyncTexture(source, fileType, options, textureHandlers, ctx, compressedTextures, callbacks, isFromMemory) {
    var handler = textureHandlers[fileType];
    
    this.type = "texture";
    this.source = source;
    this.options = options || {};
    this.handler = handler;
    this.onerror = callbacks.onerror;
    this.onprogress = callbacks.onprogress;
    this.onload = callbacks.onload;
    this.id = generateID();
    
    callbacks.onloadstart(this);

    EventDispatcher.call(this);

    this.dispatchEvent("loadstart");

    if (handler) {
        if (isFromMemory) {
            this.impl = new this.handler(source, this.options, ctx, this.onerror.bind(undefined, this), this.onload.bind(undefined, this), compressedTextures, isFromMemory);
        } else {
            this.request = getRequest(source, true, this.onloadTexture.bind(this, ctx, compressedTextures), callbacks.onerror.bind(undefined, this), callbacks.onprogress.bind(undefined, this));
        }
    } else {
        callbacks.onerror(this, "NoHandler");
        this.dispatchEvent("error");
        this.dispatchEvent("loadend");
    }
}

AsyncTexture.prototype = {
    onloadTexture: function (ctx, compressedTextures, e) {
        var target = e.target,
            response = target.response,
            status = target.status;
        
        if (status === 200) {
            this.impl = new this.handler(target.response, this.options, ctx, this.onerror.bind(undefined, this), this.onload.bind(undefined, this), compressedTextures);
            this.dispatchEvent("load");
        } else {
            this.onerror(this, "" + status);
            this.dispatchEvent("error");
        }

        this.dispatchEvent("loadend");
    },
    
    loaded: function () {
        if (this.request) {
            return (this.request.readyState === XMLHttpRequest.DONE);
        }
        
        return false;
    }
};

mixin(EventDispatcher.prototype, AsyncTexture.prototype);
