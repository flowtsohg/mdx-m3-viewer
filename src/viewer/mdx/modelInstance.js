function ModelInstance(model, textureMap) {
  BaseModelInstance.call(this, model, textureMap);
  
  this.setup(model);
}

var prototype = Object.create(BaseModelInstance.prototype);
ModelInstance.prototype = prototype;

prototype.setup = function (model) {
  var i, l, objects;

  this.counter = 0;
  this.skeleton = new Skeleton(model);
  
  if (model.particleEmitters && model.particleEmitters.length > 0) {
    objects = model.particleEmitters;

    this.particleEmitters = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.particleEmitters[i] = new ParticleEmitter(objects[i], model, this);
    }
  }
  
  if (model.particleEmitters2 && model.particleEmitters2.length > 0) {
    objects = model.particleEmitters2;

    this.particleEmitters2 = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.particleEmitters2[i] = new ParticleEmitter2(objects[i], model, this);
    }
  }

  if (model.ribbonEmitters && model.ribbonEmitters.length > 0) {
    objects = model.ribbonEmitters;

    this.ribbonEmitters = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.ribbonEmitters[i] = new RibbonEmitter(objects[i], model, this);
    }
  }
};

prototype.updateEmitters = function (emitters, allowCreate, context) {
  if (emitters) {
    for (var i = 0, l = emitters.length; i < l; i++) {
      emitters[i].update(allowCreate, this.sequence, this.frame, this.counter, context.particleRect, context.particleBillboardedRect);
    }
  }
};

prototype.update = function (instance, context) {
  var allowCreate = false;
  
  if (this.sequence !== -1) {
    var sequence = this.model.sequences[this.sequence];
    
    this.frame += context.frameTime;
    this.counter += context.frameTime;
    
    allowCreate = true;
    
    if (this.frame >= sequence.interval[1]) {
      if (this.sequenceLoopMode === 2 || (this.sequenceLoopMode === 0 && sequence.flags === 0)) {
        this.frame = sequence.interval[0];
        allowCreate = true;
      } else {
        this.frame = sequence.interval[1];
        this.counter -= context.frameTime;
        allowCreate = false;
      }
    }
  }
  
  this.skeleton.update(this.sequence, this.frame, this.counter, instance);
  
  this.updateEmitters(this.particleEmitters, allowCreate, context);
  this.updateEmitters(this.particleEmitters2, allowCreate, context);
  this.updateEmitters(this.ribbonEmitters, allowCreate, context);
};

prototype.setTeamColor = function (id) {
  var idString = ((id < 10) ? "0" + id : id);
  
  this.overrideTexture("replaceabletextures/teamcolor/teamcolor00.blp", urls.mpqFile("ReplaceableTextures/TeamColor/TeamColor" + idString + ".blp"));
  this.overrideTexture("replaceabletextures/teamglow/teamglow00.blp", urls.mpqFile("ReplaceableTextures/TeamGlow/TeamGlow" + idString + ".blp"));
  this.teamColor = id;
};

prototype.setSequence = function (id) {
  this.sequence = id;
  
  if (id === -1) {
    this.frame = 0;
  } else {
    var sequence = this.model.sequences[id];
    
    this.frame = sequence.interval[0];
  }
};

prototype.getAttachment = function (id) {
  var attachment = this.model.attachments[id];
  
  if (attachment) {
    console.log("attachment id=" + id, this.skeleton.nodes[attachment.node]);
    return this.skeleton.nodes[attachment.node];
  } else {
    return this.skeleton.nodes[0];
  }
};