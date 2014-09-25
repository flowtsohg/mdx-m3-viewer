function ModelInstance(model, textureMap) {
  this.setupImpl(model, textureMap);
}

ModelInstance.prototype = {
  setup: function (model, textureMap) {
    this.skeleton = new Skeleton(model);
    this.teamColor = 0;
  },
  
  update: function (instance, context) {
    var i, l;
    var sequenceId = this.sequence;
    var allowCreate = false;
	
    if (sequenceId !== -1) {
      var sequence = this.model.sequences[sequenceId];
      
      this.frame += FRAME_TIME_MS;
      
      if (this.frame > sequence.animationEnd) {
        if ((this.sequenceLoopMode === 0 && !(sequence.flags & 0x1)) || this.sequenceLoopMode === 2) {
          this.frame = 0;
        }
      }
	  
      allowCreate = true;
    }
    
    this.skeleton.update(sequenceId, this.frame, instance);
    
    /*
    if (this.particleEmitters) {
      for (i = 0, l = this.particleEmitters.length; i < l; i++) {
        this.particleEmitters[i].update(allowCreate, sequenceId, this.frame);
      }
	  }
    */
  },
  
  setSequence: function (sequence) {
    this.sequence = sequence;
    this.frame = 0;
  },
  
  setTeamColor: function (id) {
    this.teamColor = id;
  },
  
  getAttachment: function (id) {
    var attachment = this.model.getAttachment(id);
    
    if (attachment) {
      return this.skeleton.bones[attachment.bone];
    } else {
      return this.skeleton.root;
    }
  }
};

// Mixins
ModelInstanceImpl.call(ModelInstance.prototype);