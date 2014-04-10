// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function ModelInstance(model) {
  var i, l, objects;
  
  this.model = model;
  this.sequence = -1;
  this.frame = 0;
  this.counter = 0;
  this.loopingMode = 0;
  this.skeleton = new Skeleton(model);
  
  if (model.particleEmitters) {
    objects = model.particleEmitters;

    this.particleEmitters = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.particleEmitters[i] = new ParticleEmitter(objects[i], model, this);
    }
  }
  
  if (model.particleEmitters2) {
    objects = model.particleEmitters2;

    this.particleEmitters2 = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.particleEmitters2[i] = new ParticleEmitter2(objects[i], model, this);
    }
  }

  if (model.ribbonEmitters) {
    objects = model.ribbonEmitters;

    this.ribbonEmitters = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.ribbonEmitters[i] = new RibbonEmitter(objects[i], model, this);
    }
  }
}

ModelInstance.prototype = {
  updateEmitters: function (emitters, allowCreate) {
    if (emitters) {
      for (var i = 0, l = emitters.length; i < l; i++) {
        emitters[i].update(allowCreate, this.sequence, this.frame, this.counter);
      }
    }
  },
  
  update: function (instance) {
    var allowCreate = false;
    
    if (this.sequence !== -1) {
      var sequence = this.model.sequences[this.sequence];
      
      this.frame += 16;
      this.counter += 16;
      
      allowCreate = true;
      
      if (this.frame >= sequence.interval[1]) {
        if (this.loopingMode === 2 || (this.loopingMode === 0 && sequence.flags === 0)) {
          this.frame = sequence.interval[0];
          allowCreate = false;
        } else {
          this.frame = sequence.interval[1];
          this.couter -= 16;
          allowCreate = false;
        }
      }
    }
    
    this.skeleton.update(this.sequence, this.frame, this.counter, instance);
    
    this.updateEmitters(this.particleEmitters, allowCreate);
    this.updateEmitters(this.particleEmitters2, allowCreate);
    this.updateEmitters(this.ribbonEmitters, allowCreate);
  },
  
  render: function (instance, teamId) {
    this.model.render(this, instance.textureMap, teamId);
  },
  
  setAnimation: function (id) {
    this.sequence = id;
    
    if (id === -1) {
      this.frame = 0;
    } else {
      var sequence = this.model.sequences[id];
      
      this.frame = sequence.interval[0];
    }
  },
  
  setAnimationLooping: function (looping) {
    this.loopingMode = math.clamp(looping, 0, 2);
  },
  
  getAttachment: function (id) {
    var attachment = this.model.getAttachment(id);
    
    if (attachment) {
      return this.skeleton.nodes[attachment.node];
    }
  }
};