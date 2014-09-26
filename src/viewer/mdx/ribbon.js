function Ribbon(emitter, sequence, frame, counter) {
  this.alive = true;
  this.health = emitter.lifespan;
  
  var position = emitter.node.pivot;
  var heightBelow = getSDValue(sequence, frame, counter, emitter.sd.heightBelow, emitter.heightBelow);
  var heightAbove = getSDValue(sequence, frame, counter, emitter.sd.heightAbove, emitter.heightAbove);
  
  var p1 = [position[0], position[1] - heightBelow, position[2]];
  var p2 = [position[0], position[1] + heightAbove, position[2]];
  
  vec3.transformMat4(p1, p1, emitter.node.worldMatrix);
  vec3.transformMat4(p2, p2, emitter.node.worldMatrix);
  
  this.p1 = p1;
  this.p2 = p2;
}

Ribbon.prototype = {
  update: function (emitter) {
    this.health -= context.frameTime / 1000;
    
    var zvelocity = emitter.gravity * (context.frameTime / 1000) * (context.frameTime / 1000);
    
    this.p1[2] -= zvelocity;
    this.p2[2] -= zvelocity;
  }
};