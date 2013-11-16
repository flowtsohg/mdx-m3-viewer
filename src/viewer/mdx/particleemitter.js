// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function ParticleEmitter(emitter, model) {
	var i, l;
  var keys = Object.keys(emitter);
  
  for (i = keys.length; i--;) {
    this[keys[i]] = emitter[keys[i]];
  }
  
  this.model = model;
  this.lastCreation = 0;
  
  this.spawnModelFileName = this.spawnModelFileName.replace(/\\/g, "/").replace("MDL", "MDX");
  
  function onload(e) {
    var parser = new Parser(new BinaryReader(e.target.response));
    
    if (parser.ready) {
      this.spawnModel = new Model(parser, {}, true);
      this.spawnModel.setAnimation(0);
      
      if (DEBUG_MODE) {
        console.log(this.spawnModel);
      }
    }
  }
  
  getFile(url.mpqFile(this.spawnModelFileName), true, onload.bind(this));
  
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
    this.particles[i] = new Particle(model);
    this.reusables.push(i);
  }
}

ParticleEmitter.prototype = {
  update: function (allowCreate) {
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
          particle.update(this);
        }
      }
    }
    
    if (allowCreate && this.shouldRender()) {
      this.lastCreation += 1 * ANIMATION_SCALE;
      
      var amount = (getTrack(this.tracks.emissionRate, this.emissionRate, this.model) * FRAME_TIME) / (1 / this.lastCreation);
      
      if (amount >= 1) {
        this.lastCreation = 0;
        
        for (i = 0; i < amount; i++) {
          if (this.reusables.length > 0) {
            this.particles[this.reusables.pop()].reset(this);
          }
        }
      }
    }
  },
  
  render: function () {
    var spawnModel = this.spawnModel;
    
    if (spawnModel) {
      for (var i = 0, l = this.particles.length; i < l; i++) {
        var particle = this.particles[i];
        
        if (particle.health > 0) {
          var p = particle.position;
          
          gl.pushMatrix();
          gl.translate(p[0], p[1], p[2]);
          gl.rotate(particle.orientation, 0, 0, 1);
          
          spawnModel.render();
          
          gl.popMatrix();
        }
      }
    }
  },
  
  shouldRender: function () {
    return (getTrack(this.tracks.visibility, 0, this.model) > 0.1);
  }
};