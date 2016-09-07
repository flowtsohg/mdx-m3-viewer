function MdxEventObjectSpl(emitter) {
    var viewer = emitter.viewer;
    var ctx = viewer.gl.ctx;
    
    this.emitter = emitter;

    if (!emitter.buffer) {
        emitter.buffer = ctx.createBuffer();
        emitter.data = new Float32Array(30);

        ctx.bindBuffer(ctx.ARRAY_BUFFER, emitter.buffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, emitter.data, ctx.DYNAMIC_DRAW);
    }
    
    this.time = 0;
    this.endTime = emitter.firstIntervalTime + emitter.secondIntervalTime;
    this.location = vec3.clone(emitter.node.worldLocation);
    this.scale = vec3.clone(emitter.node.worldScale);
    this.color = vec4.create();
    this.index = 0;
}

MdxEventObjectSpl.prototype = {
    update(emitter) {
        var viewer = emitter.viewer;
        var dt = viewer.frameTime / 100;
        
        this.time = Math.min(this.time + dt, this.endTime);
        
        var time = this.time;
        var first = emitter.firstIntervalTime;
        var second = emitter.secondIntervalTime;
        var tempFactor;
        var index;
        var color = this.color;
        
        if (time < first) {
            tempFactor = time / first;
            
            vec4.lerp(color, emitter.colors[0], emitter.colors[1], tempFactor);
            index = Math.lerp(emitter.firstInterval[0], emitter.firstInterval[1], tempFactor);
        } else {
            tempFactor = (time - first) / second;
            
            vec4.lerp(color, emitter.colors[1], emitter.colors[2], tempFactor);
            index = Math.lerp(emitter.secondInterval[0], emitter.secondInterval[1], tempFactor);
        }
        
        this.index = Math.floor(index);
    },
    
    updateHW(emitter) {
        var viewer = emitter.viewer;
        var columns = emitter.columns;
        var position = this.location;
        var nodeScale = this.scale;
        var scale = emitter.scale;
        var index = this.index
        var left = index % columns;
        var top = Math.floor(index / columns);
        var right = left + 1;
        var bottom = top + 1;
        var color = this.color;
        var r = Math.floor(color[0]);
        var g = Math.floor(color[1]);
        var b = Math.floor(color[2]);
        var a = Math.floor(color[3]);
        var px = position[0];
        var py = position[1];
        var pz = position[2];
        var v1x = px - scale * nodeScale[0];
        var v1y = py - scale * nodeScale[1];
        var v1z = pz;
        var v2x = px - scale * nodeScale[0];
        var v2y = py + scale * nodeScale[1];
        var v2z = pz;
        var v3x = px + scale * nodeScale[0];
        var v3y = py + scale * nodeScale[1];
        var v3z = pz;
        var v4x = px + scale * nodeScale[0];
        var v4y = py - scale * nodeScale[1];
        var v4z = pz;
        var lta = encodeFloat3(left, top, a);
        var lba = encodeFloat3(left, bottom, a);
        var rta = encodeFloat3(right, top, a);
        var rba = encodeFloat3(right, bottom, a);
        var rgb = encodeFloat3(r, g, b);
        var data = this.emitter.data;
        
        data[0] = v1x;
        data[1] = v1y;
        data[2] = v1z;
        data[3] = lta;
        data[4] = rgb;

        data[5] = v2x;
        data[6] = v2y;
        data[7] = v2z;
        data[8] = lba;
        data[9] = rgb;

        data[10] = v3x;
        data[11] = v3y;
        data[12] = v3z;
        data[13] = rba;
        data[14] = rgb;

        data[15] = v1x;
        data[16] = v1y;
        data[17] = v1z;
        data[18] = lta;
        data[19] = rgb;

        data[20] = v3x;
        data[21] = v3y;
        data[22] = v3z;
        data[23] = rba;
        data[24] = rgb;

        data[25] = v4x;
        data[26] = v4y;
        data[27] = v4z;
        data[28] = rta;
        data[29] = rgb;
    },
    
    render(emitter) {
        var viewer = emitter.viewer;
        var gl = viewer.gl;
        var ctx = gl.ctx;
        
        var shader = gl.bindShader("wparticles");

        ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
        ctx.uniform1i(shader.variables.u_texture, 0);
        
        ctx.disable(ctx.CULL_FACE);
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthMask(0);
        ctx.enable(ctx.BLEND);
        
        switch (this.blendMode) {
            // Blend
            case 0:
                ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
                break;
            // Additive
            case 1:
                ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
                break;
            // Modulate
            case 2:
                ctx.blendFunc(ctx.ZERO, ctx.SRC_COLOR);
                break;
            // Modulate 2X
            case 3:
                ctx.blendFunc(ctx.DEST_COLOR, ctx.SRC_COLOR);
                break;
            // Alpha Key
            case 4:
                // ??
                break;
        }
        
        viewer.gl.bindTexture(emitter.texture, null, 0);
        
        ctx.uniform2fv(shader.variables.u_dimensions, emitter.dimensions);

        this.updateHW(emitter, viewer);

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.emitter.buffer);
        ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.emitter.data);

        ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 20, 0);
        ctx.vertexAttribPointer(shader.variables.a_uva_rgb, 2, ctx.FLOAT, false, 20, 12);

        ctx.drawArrays(ctx.TRIANGLES, 0, 6);
    },
    
    renderEmitters(emitter) {

    },
    
    ended() {
        return (this.time >= this.endTime);
    }
};
