function ModelInstance(model, textureMap, context) {
  BaseModelInstance.call(this, model, textureMap);
  
  this.setup(model, context);
}

var prototype = Object.create(BaseModelInstance.prototype);
ModelInstance.prototype = prototype;

prototype.setup = function (model, context) {
  this.skeleton = new Skeleton(model, context.gl.ctx);
};

prototype.update = function (worldMatrix, context) {
  var i, l;
  var sequenceId = this.sequence;
  var allowCreate = false;

  if (sequenceId !== -1) {
    var sequence = this.model.sequences[sequenceId];
    
    this.frame += context.frameTime;
    
    if (this.frame > sequence.animationEnd) {
      if ((this.sequenceLoopMode === 0 && !(sequence.flags & 0x1)) || this.sequenceLoopMode === 2) {
        this.frame = 0;
      }
    }
  
    allowCreate = true;
  }
  
  this.skeleton.update(sequenceId, this.frame, worldMatrix, context.gl.ctx);
  
  /*
  if (this.particleEmitters) {
    for (i = 0, l = this.particleEmitters.length; i < l; i++) {
      this.particleEmitters[i].update(allowCreate, sequenceId, this.frame);
    }
  }
  */
};

prototype.setSequence = function (sequence) {
  this.sequence = sequence;
  this.frame = 0;
};

prototype.setTeamColor = function (id) {
  this.teamColor = id;
};

prototype.getAttachment = function (id) {
  var attachment = this.model.getAttachment(id);
  
  if (attachment) {
    return this.skeleton.bones[attachment.bone];
  } else {
    return this.skeleton.root;
  }
};