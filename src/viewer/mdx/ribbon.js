// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Ribbon(emitter) {
  this.alive = true;
  this.health = emitter.lifespan;
  
  var position = emitter.node.pivot;
  var heightBelow = getTrack(emitter.tracks.heightBelow, emitter.heightBelow, this.model);
  var heightAbove = getTrack(emitter.tracks.heightAbove, emitter.heightAbove, this.model);
  
  this.p1 = [position[0], position[1] - heightBelow, position[2]];
  this.p2 = [position[0], position[1] + heightAbove, position[2]];
  
  math.mat4.multVec3(emitter.node.worldMatrix, this.p1, this.p1);
  math.mat4.multVec3(emitter.node.worldMatrix, this.p2, this.p2);
}

Ribbon.prototype = {
  update: function (emitter) {
    this.health -= FRAME_TIME * ANIMATION_SCALE;
    
    var zvelocity = emitter.gravity * FRAME_TIME * FRAME_TIME * ANIMATION_SCALE;
    
    this.p1[2] -= zvelocity;
    this.p2[2] -= zvelocity;
  }
};