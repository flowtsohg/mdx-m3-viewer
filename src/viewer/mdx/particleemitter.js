// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function ParticleEmitter(emitter, model, instance) {
  var i, l;
  var keys = Object.keys(emitter);
  
  for (i = keys.length; i--;) {
    this[keys[i]] = emitter[keys[i]];
  }
  
  this.lastCreation = 0;
  
  var path = emitter.path.replace(/\\/g, "/").replace("MDL", "MDX");
  
  this.spawnModel = loadModelInstanceNoRender(urls.mpqFile(path));
  this.spawnModel.setAnimation(0);
  
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
    particles = Math.round(biggest * Math.ceil(this.lifespan) * 2);
  } else {
    particles = Math.round(this.emissionRate * Math.ceil(this.lifespan));
  }
  
  this.particles = [];
  this.reusables = [];
  
  for (i = particles; i--;) {
    this.particles[i] = new Particle();
    this.reusables.push(i);
  }
  
  this.node = instance.skeleton.nodes[this.node];
  this.sd = parseSDTracks(emitter.tracks, model);
}

ParticleEmitter.prototype = {
  update: function (allowCreate, sequence, frame, counter) {
    var i, l;
    
    if (this.spawnModel) {
      this.spawnModel.update();
    }
    
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
    
    if (allowCreate && this.shouldRender(sequence, frame, counter)) {
      this.lastCreation += 1;
      
      var amount = (getSDValue(sequence, frame, counter, this.sd.emissionRate, this.emissionRate) * FRAME_TIME) / (1 / this.lastCreation);
      
      if (amount >= 1) {
        this.lastCreation = 0;
        
        for (i = 0; i < amount; i++) {
          if (this.reusables.length > 0) {
            this.particles[this.reusables.pop()].reset(this, sequence, frame, counter);
          }
        }
      }
    }
  },
  
  render: function (allowTeamColors) {
    var spawnModel = this.spawnModel;
    
    if (spawnModel) {
      for (var i = 0, l = this.particles.length; i < l; i++) {
        var particle = this.particles[i];
        
        if (particle.health > 0) {
          var p = particle.position;
          
          gl.pushMatrix();
          gl.translate(p[0], p[1], p[2]);
          gl.rotate(particle.orientation, 0, 0, 1);
          
          spawnModel.render(allowTeamColors);
          
          gl.popMatrix();
        }
      }
    }
  },
  
  shouldRender: function (sequence, frame, counter) {
    return getSDValue(sequence, frame, counter, this.sd.visibility) > 0.1;
  }
};