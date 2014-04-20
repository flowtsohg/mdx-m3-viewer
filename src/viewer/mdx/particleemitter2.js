function ParticleEmitter2(emitter, model, instance) {
  var i, l;
  var keys = Object.keys(emitter);
  
  for (i = keys.length; i--;) {
    this[keys[i]] = emitter[keys[i]];
  }
  
  this.model = model;
  this.textures = model.textures;
  
  this.lastCreation = 0;
  
  var particles;
  
  // This is the maximum number of particles that are going to exist at the same time
  if (this.tracks.emissionRate) {
    var tracks = this.tracks.emissionRate;
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
  
  this.buffer = ctx.createBuffer();
  this.data = new Float32Array(54 * particles);
  
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
  
  for (i = 0; i < 3; i++) {
    this.colors[i] = [this.segmentColor[i][0], this.segmentColor[i][1], this.segmentColor[i][2], this.segmentAlpha[i] / 255];
  }
  
  this.node = instance.skeleton.nodes[this.node];
  this.sd = parseSDTracks(emitter.tracks, model);
}

ParticleEmitter2.prototype = {
  update: function (allowCreate, sequence, frame, counter) {
    var i, l;
    
    for (i = 0, l = this.particles.length; i < l; i++) {
      var particle = this.particles[i];
      
      if (particle.alive) {
        if (particle.health <= 0) {
          particle.alive = false;
          
          this.reusables.push(i);
        } else {
          particle.update(this, sequence, frame, counter);
        }
      }
    }
    
    // The snow emitter should always run
    if (allowCreate && this.shouldRender(sequence, frame, counter)) {
      this.lastCreation += 1;
      
      
      var amount = (getSDValue(sequence, frame, counter, this.sd.emissionRate, this.emissionRate) * FRAME_TIME) / (1 / this.lastCreation);
      
      if (amount >= 1) {
        this.lastCreation = 0;
        
        for (i = 0; i < amount; i++) {
          if (this.head && this.reusables.length > 0) {
            this.particles[this.reusables.pop()].reset(this, true, sequence, frame, counter);
          }
          
          if (this.tail && this.reusables.length > 0) {
            this.particles[this.reusables.pop()].reset(this, false, sequence, frame, counter);
          }
        }
      }
    }
  },
  
  render: function (model, textureMap, allowTeamColors) {
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
    
    for (var i = 0, l = this.particles.length; i < l; i++) {
      var particle = this.particles[i];
      var index = i * 54;
      
      if (particle.health > 0) {
        var position = particle.position;
        var scale = particle.scale;
        var left = this.cellWidth * particle.column;
        var top = this.cellHeight * particle.row;
        var right = this.cellWidth * (particle.column + 1);
        var bottom = this.cellHeight * (particle.row + 1);
        var color = particle.color;
        var r = color[0];
        var g = color[1];
        var b = color[2];
        var a = color[3];
        var px = position[0];
        var py = position[1];
        var pz = position[2];
        var v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z, v4x, v4y, v4z;
        
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
        
        data[index + 0] = v1x;
        data[index + 1] = v1y;
        data[index + 2] = v1z;
        data[index + 3] = left;
        data[index + 4] = top;
        data[index + 5] = r;
        data[index + 6] = g;
        data[index + 7] = b;
        data[index + 8] = a;
        
        data[index + 9] = v2x;
        data[index + 10] = v2y;
        data[index + 11] = v2z;
        data[index + 12] = left;
        data[index + 13] = bottom;
        data[index + 14] = r;
        data[index + 15] = g;
        data[index + 16] = b;
        data[index + 17] = a;
        
        data[index + 18] = v3x;
        data[index + 19] = v3y;
        data[index + 20] = v3z;
        data[index + 21] = right;
        data[index + 22] = bottom;
        data[index + 23] = r;
        data[index + 24] = g;
        data[index + 25] = b;
        data[index + 26] = a;
        
        data[index + 27] = v1x;
        data[index + 28] = v1y;
        data[index + 29] = v1z;
        data[index + 30] = left;
        data[index + 31] = top;
        data[index + 32] = r;
        data[index + 33] = g;
        data[index + 34] = b;
        data[index + 35] = a;
        
        data[index + 36] = v3x;
        data[index + 37] = v3y;
        data[index + 38] = v3z;
        data[index + 39] = right;
        data[index + 40] = bottom;
        data[index + 41] = r;
        data[index + 42] = g;
        data[index + 43] = b;
        data[index + 44] = a;
        
        data[index + 45] = v4x;
        data[index + 46] = v4y;
        data[index + 47] = v4z;
        data[index + 48] = right;
        data[index + 49] = top;
        data[index + 50] = r;
        data[index + 51] = g;
        data[index + 52] = b;
        data[index + 53] = a;
      } else {
        for (var j = 0; j < 6; j++) {
          var offset = index + j * 9;
          
          data[offset + 0] = 0;
          data[offset + 1] = 0;
          data[offset + 2] = 0;
        }
      }
    }
    
    switch (this.filterMode) {
      case 1:
        ctx.blendFunc(ctx.SRC_COLOR, ctx.ONE);
        break;
      case 2:
      case 3:
        ctx.blendFunc(ctx.SRC_ZERO, ctx.SRC_COLOR);
        break;
      case 4:
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
        break;
      default:
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
    }
    
    bindTexture(this.textures[this.textureId], 0, this.model.textureMap, textureMap);
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
    ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.data);
    
    gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, 36, 0);
    gl.vertexAttribPointer("a_uv", 2, ctx.FLOAT, false, 36, 12);
    gl.vertexAttribPointer("a_color", 4, ctx.FLOAT, false, 36, 20);
    
    ctx.drawArrays(ctx.TRIANGLES, 0, this.particles.length * 6);
  },
  /*
  renderLines: function () {
    var pv1 = [-1, -1, 0];
    var pv2 = [-1, 1, 0];
    var pv3 = [1, 1, 0];
    var pv4 = [1, -1, 0];
    
    var csx = [1, 0, 0];
    var csy = [0, 1, 0];
    var csz = [0, 0, 1];
    
    if (!this.node.xYQuad) {
      var xRotation = [];
      var zRotation = [];
      var orientation = [];
      
      math.mat4.makeRotateX(xRotation, math.toRad(camera.rotation[0]));
      math.mat4.makeRotateZ(zRotation, -math.toRad(camera.rotation[2]));
      math.mat4.multMat(zRotation, xRotation, orientation);
      
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
    
    for (var i = 0, l = this.particles.length; i < l; i++) {
      var particle = this.particles[i];
      var index = i * 54;
      
      if (particle.alive) {
        var position = particle.position;
        var scale = particle.scale;
        var px = position[0];
        var py = position[1];
        var pz = position[2];
        var v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z, v4x, v4y, v4z;
        
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
          var v = particle.velocity;
          
          var px2 = px + v[0];
          var py2 = py + v[1];
          var pz2 = pz + v[2];
          
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
          
          gl.drawLine(px, py, pz, px2, py2, pz2);
        }
        
        gl.drawLine(v1x, v1y, v1z, v2x, v2y, v2z);
        gl.drawLine(v2x, v2y, v2z, v3x, v3y, v3z);
        gl.drawLine(v3x, v3y, v3z, v4x, v4y, v4z);
        gl.drawLine(v4x, v4y, v4z, v1x, v1y, v1z);
      }
    }
  },
  */
  shouldRender: function (sequence, frame, counter) {
    return getSDValue(sequence, frame, counter, this.sd.visibility) > 0.1;
  }
};