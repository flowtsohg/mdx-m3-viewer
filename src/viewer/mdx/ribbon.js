function Ribbon(emitter, sequence, frame, counter) {
  this.alive = true;
  this.health = emitter.lifespan;
  
  var position = emitter.node.pivot;
  var heightBelow = getSDValue(sequence, frame, counter, emitter.sd.heightBelow, emitter.heightBelow);
  var heightAbove = getSDValue(sequence, frame, counter, emitter.sd.heightAbove, emitter.heightAbove);
  
  this.p1 = [position[0], position[1] - heightBelow, position[2]];
  this.p2 = [position[0], position[1] + heightAbove, position[2]];
  
  math.mat4.multVec3(emitter.node.worldMatrix, this.p1, this.p1);
  math.mat4.multVec3(emitter.node.worldMatrix, this.p2, this.p2);
}

Ribbon.prototype = {
  update: function (emitter) {
    this.health -= FRAME_TIME;
    
    var zvelocity = emitter.gravity * FRAME_TIME * FRAME_TIME;
    
    this.p1[2] -= zvelocity;
    this.p2[2] -= zvelocity;
  }
};