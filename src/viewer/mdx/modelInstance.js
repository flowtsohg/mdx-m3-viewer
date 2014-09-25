function ModelInstance(model, textureMap) {
  this.setupImpl(model, textureMap);
}

ModelInstance.prototype = {
  setup: function (model, textureMap) {
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
  },
  
  updateEmitters: function (emitters, allowCreate, context) {
    if (emitters) {
      for (var i = 0, l = emitters.length; i < l; i++) {
        emitters[i].update(allowCreate, this.sequence, this.frame, this.counter, context.particleRect, context.particleBillboardedRect);
      }
    }
  },
  
  update: function (instance, context) {
    var allowCreate = false;
    
    if (this.sequence !== -1) {
      var sequence = this.model.sequences[this.sequence];
      
      this.frame += FRAME_TIME_MS;
      this.counter += FRAME_TIME_MS;
      
      allowCreate = true;
      
      if (this.frame >= sequence.interval[1]) {
        if (this.sequenceLoopMode === 2 || (this.sequenceLoopMode === 0 && sequence.flags === 0)) {
          this.frame = sequence.interval[0];
          allowCreate = true;
        } else {
          this.frame = sequence.interval[1];
          this.couter -= frames;
          allowCreate = false;
        }
      }
    }
    
    this.skeleton.update(this.sequence, this.frame, this.counter, instance);
    
    this.updateEmitters(this.particleEmitters, allowCreate, context);
    this.updateEmitters(this.particleEmitters2, allowCreate, context);
    this.updateEmitters(this.ribbonEmitters, allowCreate, context);
  },
  
  setTeamColor: function (id) {
    var idString = ((id < 10) ? "0" + id : id);
    
    this.overrideTexture("replaceabletextures/teamcolor/teamcolor00.blp", urls.mpqFile("ReplaceableTextures/TeamColor/TeamColor" + idString + ".blp"));
    this.overrideTexture("replaceabletextures/teamglow/teamglow00.blp", urls.mpqFile("ReplaceableTextures/TeamGlow/TeamGlow" + idString + ".blp"));
  },
  
  setSequence: function (id) {
    this.sequence = id;
    
    if (id === -1) {
      this.frame = 0;
    } else {
      var sequence = this.model.sequences[id];
      
      this.frame = sequence.interval[0];
    }
  },
  
  getAttachment: function (id) {
    var attachment = this.model.attachments[id];
    
    if (attachment) {
      return this.skeleton.nodes[attachment.node];
    } else {
      return this.skeleton.nodes[0];
    }
  }
};

// Mixins
ModelInstanceImpl.call(ModelInstance.prototype);