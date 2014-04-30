function RibbonEmitter(emitter, model, instance) {
  var i, l;
  var keys = Object.keys(emitter);
  
  for (i = keys.length; i--;) {
    this[keys[i]] = emitter[keys[i]];
  }
  
  var ribbons = Math.ceil(this.emissionRate * this.lifespan);
  
  this.model = model;
  this.textures = model.textures;
  
  this.maxRibbons = ribbons;
  this.lastCreation = 0;
  this.ribbons = [];
  this.data = new Float32Array(ribbons  * 10);
  this.buffer = ctx.createBuffer();
  
  ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, this.data, ctx.DYNAMIC_DRAW);
  
  this.cellWidth = 1 / this.columns;
  this.cellHeight = 1 / this.rows;
  
  var groups = [[], [], [], []];
  var layers = model.materials[this.materialId].layers;
        
  for (i = 0, l = layers.length; i < l; i++) {
    var layer = new Layer(layers[i], 0);
    
    groups[layer.renderOrder].push(layer);
  }
      
  this.layers = groups[0].concat(groups[1]).concat(groups[2]).concat(groups[3]);
  
  this.node = instance.skeleton.nodes[this.node];
  this.sd = parseSDTracks(emitter.tracks, model);
}

RibbonEmitter.prototype = {
  update: function (allowCreate, sequence, frame, counter) {
    for (var i = 0, l = this.ribbons.length; i < l; i++) {
      this.ribbons[i].update(this);
    }
    
    while (this.ribbons.length > 0 && this.ribbons[0].health <= 0) {
      this.ribbons.shift();
    }
    
    if (allowCreate && this.shouldRender(sequence, frame, counter)) {
      this.lastCreation += 1;
      
      var amount = Math.floor((this.emissionRate * FRAME_TIME) / (1 / this.lastCreation));
      
      if (amount > 0) {
        this.lastCreation = 0;
        
        for (; amount--;) {
          this.ribbons.push(new Ribbon(this, sequence, frame, counter));
        }
      }
    }
  },
  
  render: function (sequence, frame, counter, textureMap, shader) {
    var i, l;
    var ribbons = Math.min(this.ribbons.length, this.maxRibbons);
    
    if (ribbons > 2) {
      var textureSlot = getSDValue(sequence, frame, counter, this.sd.textureSlot, 0);
      //var uvOffsetX = (textureSlot % this.columns) / this.columns;
      var uvOffsetY = (Math.floor(textureSlot / this.rows) - 1) / this.rows;
      var uvFactor = 1 / ribbons * this.cellWidth;
      var top = uvOffsetY;
      var bottom = uvOffsetY + this.cellHeight;
      var data = this.data;
      
      for (i = 0, l = ribbons; i < l; i++) {
        var index = i * 10;
        var ribbon = this.ribbons[i];
        var left = (ribbons - i) * uvFactor;
        var right = left - uvFactor;
        var v1 = ribbon.p2;
        var v2 = ribbon.p1;
      
        data[index + 0] = v1[0];
        data[index + 1] = v1[1];
        data[index + 2] = v1[2];
        data[index + 3] = left;
        data[index + 4] = top;
        
        data[index + 5] = v2[0];
        data[index + 6] = v2[1];
        data[index + 7] = v2[2];
        data[index + 8] = right;
        data[index + 9] = bottom;
      }
      
      ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
      ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.data);
      
      ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 20, 0);
      ctx.vertexAttribPointer(shader.variables.a_uv, 2, ctx.FLOAT, false, 20, 12);
      //gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, 20, 0);
      //gl.vertexAttribPointer("a_uv", 2, ctx.FLOAT, false, 20, 12);
      
      for (i = 0, l = this.layers.length; i < l; i++) {
        var layer = this.layers[i];
        
        if (layer.shouldRender(sequence, frame, counter)) {
          var modifier = [1, 1, 1, 1];
          var uvoffset = [0 ,0];
          
          layer.setMaterial();
          
          var textureId = getSDValue(sequence, frame, counter, layer.sd.textureId, layer.textureId);
          
          bindTexture(this.textures[textureId], 0, this.model.textureMap, textureMap);
          
          var color = getSDValue(sequence, frame, counter, this.sd.color, this.color);
          var alpha = getSDValue(sequence, frame, counter, this.sd.alpha, this.alpha);
          
          modifier[0] = color[2];
          modifier[1] = color[1];
          modifier[2] = color[0];
          modifier[3] = alpha;
          
          ctx.uniform4fv(shader.variables.u_modifier, modifier);
          //gl.setParameter("u_modifier", modifier);
          
          if (layer.textureAnimationId !== -1 && this.model.textureAnimations) {
            var textureAnimation = this.model.textureAnimations[layer.textureAnimationId];
            // What is Z used for?
            var v = v = getSDValue(sequence, frame, counter, textureAnimation.sd.translation);
            
            uvoffset[0] = v[0];
            uvoffset[1] = v[1];
          }
          
          ctx.uniform2fv(shader.variables.u_uv_offset, uvoffset);
          ctx.uniform3fv(shader.variables.u_type, [0, 0, 0]);
          
          //gl.setParameter("u_uv_offset", uvoffset);
          //gl.setParameter("u_type", [0, 0, 0]);
          
          ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, ribbons * 2);
        }
      }
    }
  },
  
  shouldRender: function (sequence, frame, counter) {
    return getSDValue(sequence, frame, counter, this.sd.visibility) > 0.1;
  }
};