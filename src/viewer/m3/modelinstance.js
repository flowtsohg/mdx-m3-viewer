function ModelInstance(model) {
  this.model = model;
  this.frame = 0;
  this.loopingMode = 0;
  this.sequence = -1;
  this.skeleton = new Skeleton(model);
  
  this.meshVisibilities = [];
  
  for (i = 0, l = model.getMeshCount(); i < l; i++) {
    this.meshVisibilities[i] = true;
  }
}

ModelInstance.prototype = {
  update: function (instance, baseParticle, billboardedParticle) {
    var i, l;
    var sequenceId = this.sequence;
    var allowCreate = false;
	
    if (sequenceId !== -1) {
      var sequence = this.model.sequences[sequenceId];
      
      this.frame += FRAME_TIME * 1000; // M3 models work in milliseconds 
      
      if (this.frame > sequence.animationEnd) {
        if ((this.loopingMode === 0 && !(sequence.flags & 0x1)) || this.loopingMode === 2) {
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
  
  render: function (instance, allowTeamColors, wireframe) {
    this.model.render(instance, this, allowTeamColors, wireframe);
  },
  
  renderEmitters: function (instance, allowTeamColors) {
    this.model.renderEmitters(instance, this, allowTeamColors);
  },
  
  renderColor: function (instance) {
    this.model.renderColor(this, instance.color);
  },
  
  setSequence: function (sequence) {
    this.sequence = sequence;
    this.frame = 0;
  },
  
  setSequenceLoopMode: function (looping) {
    this.loopingMode = math.clamp(looping, 0, 2);
  },
  
  getAttachment: function (id) {
    var attachment = this.model.getAttachment(id);
    
    if (attachment) {
      return this.skeleton.bones[attachment.bone];
    }
  },
  
  getMeshVisibilities: function () {
    return Array.copy(this.meshVisibilities);
  },
  
  setMeshVisibility: function (meshId, b) {
    this.meshVisibilities[meshId] = b;
  },
  
  getMeshVisibility: function (meshId) {
    return this.meshVisibilities[meshId];
  }
};