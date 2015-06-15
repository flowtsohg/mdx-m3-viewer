Mdx.EventObjectUbr = function (emitter, context) {
    var ctx = context.gl.ctx;
    
    this.buffer = ctx.createBuffer();
    this.data = new Float32Array(30);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, this.data, ctx.DYNAMIC_DRAW);
    
    this.time = 0;
    this.endTime = emitter.firstIntervalTime + emitter.secondIntervalTime + emitter.thirdIntervalTime;
    this.location = vec3.clone(emitter.node.worldLocation);
    this.scale = vec3.clone(emitter.node.scale);
    this.color = vec4.create();
    this.index = 0;
};

Mdx.EventObjectUbr.prototype = {
    update: function (emitter, context) {
        var dt = context.frameTime / 100;
        
        this.time = Math.min(this.time + dt, this.endTime);
        
        var time = this.time;
        var first = emitter.firstIntervalTime;
        var second = emitter.secondIntervalTime;
        var third = emitter.thirdIntervalTime;
        var tempFactor;
        var index;
        var color = this.color;
        
        if (time < first) {
            tempFactor = time / first;
            
            vec4.lerp(color, emitter.colors[0], emitter.colors[1], tempFactor);
        } else if (time < first + second) {
            vec4.copy(color, emitter.colors[1]);
        } else {
            tempFactor = (time - first - second) / third;
            
            vec4.lerp(color, emitter.colors[1], emitter.colors[2], tempFactor);
        }
        
        this.updateHW(emitter, context);
    },
    
    updateHW: Mdx.EventObjectSpl.prototype.updateHW,    
    render: Mdx.EventObjectSpl.prototype.render,
    renderEmitters: Mdx.EventObjectSpl.prototype.renderEmitters,
    ended: Mdx.EventObjectSpl.prototype.ended
};
