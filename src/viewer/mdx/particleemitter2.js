function ParticleEmitter2(emitter, model, instance) {
  var i, l;
  var keys = Object.keys(emitter);
  
  for (i = keys.length; i--;) {
    this[keys[i]] = emitter[keys[i]];
  }
  
  this.model = model;
  this.textures = model.textures;
  
  this.lastCreation = 1;
  
  var particles;
  
  // This is the maximum number of particles that are going to exist at the same time
  if (this.tracks.emissionRate) {
    var tracks = this.tracks.emissionRate.tracks;
    var biggest = 0;
    
    for (i = 0, l = tracks.length; i < l; i++) {
      var track = tracks[i];
      
      if (track.vector > biggest) {
        biggest = track.vector;
      }
    }
    // For a reason I can't understand, biggest*lifespan isn't enough for emission rate tracks, multiplying by 2 seems to be the lowest reasonable value that works
    particles = Math.ceil(biggest) * Math.ceil(this.lifespan) * 2;
  } else {
    // +3 because for some reason rate*lifespan isn't working properly
    // Do I have a problem with the update loop?
    particles = Math.ceil(this.emissionRate) * Math.ceil(this.lifespan) + 3;
  }
  
  this.head = (this.headOrTail === 0 || this.headOrTail === 2);
  this.tail = (this.headOrTail === 1 || this.headOrTail === 2);
  
  if (this.head && this.tail) {
    particles *= 2;
  }
  
  this.particles = [];
  this.reusables = [];
  this.usedParticles = {};
  this.usedParticlesKeys = [];
    
  this.buffer = ctx.createBuffer();
  this.data = new Float32Array(30 * particles);
  
  ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, this.data, ctx.DYNAMIC_DRAW);
  
  for (i = particles; i--;) {
    this.particles[i] = new Particle2();
    this.reusables.push(i);
  }
  
  // The repeat variables are probably not supposed to be used like this...
  if (this.head) {
    this.headFrames = (this.headInterval[1] - this.headInterval[0] + 1) * this.headInterval[2];
    this.headDecayFrames = (this.headDecayInterval[1] - this.headDecayInterval[0] + 1) * this.headDecayInterval[2];
  } else {
    this.headFrames = 0;
    this.headDecayFrames = 0;
  }
  
  if (this.tail) {
    this.tailFrames = (this.tailInterval[1] - this.tailInterval[0] + 1) * this.tailInterval[2];
    this.tailDecayFrames = (this.tailDecayInterval[1] - this.tailDecayInterval[0] + 1) * this.tailDecayInterval[2];
  } else {
    this.tailFrames = 0;
    this.tailDecayFrames = 0;
  }
  
  this.numberOfFrames = this.headFrames + this.headDecayFrames + this.tailFrames + this.tailDecayFrames;
  this.cellWidth = 1 / this.columns;
  this.cellHeight = 1 / this.rows;
  this.colors = [];
  
  var colors = this.segmentColor;
  var alpha = this.segmentAlpha;
  
  for (i = 0; i < 3; i++) {
    this.colors[i] = [Math.floor(colors[i][0] * 256), Math.floor(colors[i][1] * 256), Math.floor(colors[i][2] * 256), alpha[i]];
  }
  
  this.node = instance.skeleton.nodes[this.node];
  this.sd = parseSDTracks(emitter.tracks, model);
}

ParticleEmitter2.prototype = {
  update: function (allowCreate, sequence, frame, counter) {
    var keys = this.usedParticlesKeys;
    var i, l;
    var particle;
    var died = false;
    
    for (i = 0, l = keys.length; i < l; i++) {
      particle = this.particles[keys[i]];
      
      if (particle.health <= 0) {
        this.reusables.push(particle.id);
        delete this.usedParticles[keys[i]];
        died = true;
      } else {
        particle.update(this, sequence, frame, counter);
      }
    }
    
    if (died) {
      this.usedParticlesKeys = Object.keys(this.usedParticles);
    }
    
    if (allowCreate && this.shouldRender(sequence, frame, counter)) {
      var amount = getSDValue(sequence, frame, counter, this.sd.emissionRate, this.emissionRate) * FRAME_TIME * this.lastCreation;
      
      if (amount > 0) {
        this.lastCreation += 1;
      }
      
      if (amount >= 1) {
        var index;
        
        this.lastCreation = 1;
        
        for (i = 0; i < amount; i++) {
          if (this.head && this.reusables.length > 0) {
            index = this.reusables.pop();
            
            this.particles[index].reset(this, true, index, sequence, frame, counter);
            this.usedParticles[index] = 1;
            this.usedParticlesKeys.push(index);
          }
          
          if (this.tail && this.reusables.length > 0) {
            index = this.reusables.pop();
            
            this.particles[index].reset(this, false, index, sequence, frame, counter);
            this.usedParticles[index] = 1;
            this.usedParticlesKeys.push(index);
          }
        }
      }
    }
    
    this.updateHW();
  },
  
  updateHW: function () {
    var keys = this.usedParticlesKeys;
    var data = this.data;
    
    var pv1 = [-1, -1, 0];
    var pv2 = [-1, 1, 0];
    var pv3 = [1, 1, 0];
    var pv4 = [1, -1, 0];
    
    var csx = [1, 0, 0];
    var csy = [0, 1, 0];
    var csz = [0, 0, 1];
    
    if (!this.node.xYQuad) {
      var orientation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      
      math.mat4.rotate(orientation, -math.toRad(camera.r[1]), 0, 0, 1);
      math.mat4.rotate(orientation, -math.toRad(camera.r[0]), 1, 0, 0);
      
      if (this.head) {
        math.mat4.multVec3(orientation, pv1, pv1);
        math.mat4.multVec3(orientation, pv2, pv2);
        math.mat4.multVec3(orientation, pv3, pv3);
        math.mat4.multVec3(orientation, pv4, pv4);
      }
      
      if (this.tail) {
        math.mat4.multVec3(orientation, csx, csx);
        math.mat4.multVec3(orientation, csy, csy);
        math.mat4.multVec3(orientation, csz, csz);
      }
    }
    
    var particle, index, position, scale, textureIndex, left, top, right, bottom, color, r, g, b, a, px, py, pz;
    var v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z, v4x, v4y, v4z;
    var lta, lba, rta, rba, rgb;
    
    for (var i = 0, l = keys.length; i < l; i++) {
      particle = this.particles[keys[i]];
      index = i * 30;
      
      position = particle.position;
      scale = particle.scale;
      textureIndex = particle.index;
      left = textureIndex % this.columns;
      top = Math.floor(textureIndex / this.columns);
      right = left + 1;
      bottom = top + 1;
      color = particle.color;
      r = Math.floor(color[0]);
      g = Math.floor(color[1]);
      b = Math.floor(color[2]);
      a = Math.floor(color[3]);
      px = position[0];
      py = position[1];
      pz = position[2];
      
      if (particle.head) {
        v1x = px + pv1[0] * scale;
        v1y = py + pv1[1] * scale;
        v1z = pz + pv1[2] * scale;
        v2x = px + pv2[0] * scale;
        v2y = py + pv2[1] * scale;
        v2z = pz + pv2[2] * scale;
        v3x = px + pv3[0] * scale;
        v3y = py + pv3[1] * scale;
        v3z = pz + pv3[2] * scale;
        v4x = px + pv4[0] * scale;
        v4y = py + pv4[1] * scale;
        v4z = pz + pv4[2] * scale;
      } else {
        var tailLength = particle.tailLength;
        var v = particle.velocity;
        var offsetx = tailLength * v[0];
        var offsety = tailLength * v[1];
        var offsetz = tailLength * v[2];
        
        var px2 = px + offsetx;
        var py2 = py + offsety;
        var pz2 = pz + offsetz;
        
        px -= offsetx;
        py -= offsety;
        pz -= offsetz;
                /*
        v1x = px2 - csx[0] * scale + csz[0] * scale;
        v1y = py2 - csx[1] * scale + csz[1] * scale;
        v1z = pz2 - csx[2] * scale + csz[2] * scale;

        v2x = px - csx[0] * scale - csz[0] * scale;
        v2y = py - csx[1] * scale - csz[1] * scale;
        v2z = pz - csx[2] * scale - csz[2] * scale;
        v3x = px + csx[0] * scale - csz[0] * scale;
        v3y = py + csx[1] * scale - csz[1] * scale;
        v3z = pz + csx[2] * scale - csz[2] * scale;
        v4x = px2 + csx[0] * scale + csz[0] * scale;
        v4y = py2 + csx[1] * scale + csz[1] * scale;
        v4z = pz2 + csx[2] * scale + csz[2] * scale;
        */
        v1x = px2 - csx[0] * scale;
        v1y = py2 - csx[1] * scale;
        v1z = pz2 - csx[2] * scale;

        v2x = px - csx[0] * scale;
        v2y = py - csx[1] * scale;
        v2z = pz - csx[2] * scale;
        
        v3x = px + csx[0] * scale;
        v3y = py + csx[1] * scale;
        v3z = pz + csx[2] * scale;
        
        v4x = px2 + csx[0] * scale;
        v4y = py2 + csx[1] * scale;
        v4z = pz2 + csx[2] * scale;
      }
      
      lta = encodeFloat3(left, top, a);
      lba = encodeFloat3(left, bottom, a);
      rta = encodeFloat3(right, top, a);
      rba = encodeFloat3(right, bottom, a);
      rgb = encodeFloat3(r, g, b);
      
      data[index + 0] = v1x;
      data[index + 1] = v1y;
      data[index + 2] = v1z;
      data[index + 3] = lta;
      data[index + 4] = rgb;
      
      data[index + 5] = v2x;
      data[index + 6] = v2y;
      data[index + 7] = v2z;
      data[index + 8] = lba;
      data[index + 9] = rgb;
      
      data[index + 10] = v3x;
      data[index + 11] = v3y;
      data[index + 12] = v3z;
      data[index + 13] = rba;
      data[index + 14] = rgb;
      
      data[index + 15] = v1x;
      data[index + 16] = v1y;
      data[index + 17] = v1z;
      data[index + 18] = lta;
      data[index + 19] = rgb;
      
      data[index + 20] = v3x;
      data[index + 21] = v3y;
      data[index + 22] = v3z;
      data[index + 23] = rba;
      data[index + 24] = rgb;
      
      data[index + 25] = v4x;
      data[index + 26] = v4y;
      data[index + 27] = v4z;
      data[index + 28] = rta;
      data[index + 29] = rgb;
    }
  },
  
  render: function (textureMap) {
    var particles = this.usedParticlesKeys.length;
    
    
    if (particles > 0) {
      var filterMode = this.filterMode;
      
      if (filterMode === 1) {
        ctx.blendFunc(ctx.ONE, ctx.ONE);
      } else if (filterMode === 2 || filterMode === 3) {
        ctx.blendFunc(ctx.SRC_ZERO, ctx.SRC_COLOR);
      } else if (filterMode === 4) {
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
      } else {
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
      }
      
      bindTexture(this.textures[this.textureId], 0, this.model.textureMap, textureMap);
      
      ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
      ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.data.subarray(0, particles * 30 + 1));
      
      gl.setParameter("u_dimensions", [this.columns, this.rows]);
      
      gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, 20, 0);
      gl.vertexAttribPointer("a_uva", 1, ctx.FLOAT, false, 20, 12);
      gl.vertexAttribPointer("a_rgb", 1, ctx.FLOAT, false, 20, 16);
      
      ctx.drawArrays(ctx.TRIANGLES, 0, particles * 6);
    }
  },
  
  shouldRender: function (sequence, frame, counter) {
    return getSDValue(sequence, frame, counter, this.sd.visibility, 0) > 0.1;
  }
};