function Skeleton(model) {
  var i, l;
  var pivots = model.pivots;
  var nodes = model.nodes;
  var bones = model.bones;
  var hierarchy = model.hierarchy;
  
  this.hierarchy = hierarchy;
  this.nodes = [];
  
  for (i = 0, l = nodes.length; i < l; i++) {
    this.nodes[i] = new ShallowNode(nodes[i]);
  }
  
  // If there are no original bones, reference the root node injected by the parser, since the shader requires at least one bone
  this.bones = bones || [{node: 0}];
    
  this.hwbones = new Float32Array(16 + (16 * this.bones.length));
  this.boneTexture = ctx.createTexture();
  this.boneTextureSize = Math.max(2, math.powerOfTwo(this.bones.length + 1)) * 4;
  this.texelFraction = 1 / this.boneTextureSize;
  this.boneFraction = this.texelFraction * 4;
  
  ctx.activeTexture(ctx.TEXTURE1);
  ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.boneTextureSize, 1, 0, ctx.RGBA, ctx.FLOAT, null);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
  ctx.bindTexture(ctx.TEXTURE_2D, null);
  gl.bindTexture(null, 1);
}

Skeleton.prototype = {
  update: function (sequence, frame, counter, instance) {
    var nodes = this.nodes;
    var hierarchy = this.hierarchy;
    
    // The root is always at index 0, since it's injected by the parser
    math.mat4.makeIdentity(nodes[0].worldMatrix);
    math.mat4.multMat(nodes[0].worldMatrix, instance.getTransform(), nodes[0].worldMatrix);
    
    for (var i = 1, l = hierarchy.length; i < l; i++) {
      this.updateNode(nodes[hierarchy[i]], sequence, frame, counter);
    }
      
    this.updateBoneTexture();
  },
  
  updateNode: function (node, sequence, frame, counter) {
    var nodeImpl = node.nodeImpl;
    var pivot = node.pivot;
    var translation = getSDValue(sequence, frame, counter, nodeImpl.sd.translation, [0, 0, 0]);
    var rotation = getSDValue(sequence, frame, counter, nodeImpl.sd.rotation, [0, 0, 0, 1]);
    var scale = getSDValue(sequence, frame, counter, nodeImpl.sd.scaling, [1, 1, 1]);
    var localMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    
    if (translation[0] !== 0 || translation[1] !== 0 || translation[2] !== 0) {
      math.mat4.translate(localMatrix, translation[0], translation[1], translation[2]);
    }
    
    if (rotation[0] !== 0 || rotation[1] !== 0 || rotation[2] !== 0 || rotation[3] !== 1) {
      var rotationMatrix = [];
      
      math.quaternion.toRotationMatrix4(rotation, rotationMatrix);
      
      math.mat4.translate(localMatrix, pivot[0], pivot[1], pivot[2]);
      math.mat4.multMat(localMatrix, rotationMatrix, localMatrix);
      math.mat4.translate(localMatrix, -pivot[0], -pivot[1], -pivot[2]);
    }
    
    if (scale[0] !== 1 || scale[1] !== 1 || scale[2] !== 1) {
      math.mat4.translate(localMatrix, pivot[0], pivot[1], pivot[2]);
      math.mat4.scale(localMatrix, scale[0], scale[1], scale[2]);
      math.mat4.translate(localMatrix, -pivot[0], -pivot[1], -pivot[2]);
      
      math.vec3.setFromArray(node.scale, scale);
    }
    
    var parent = this.nodes[node.parentId];
    
    math.vec3.scaleVec(node.scale, parent.scale, node.scale);
    math.mat4.multMat(parent.worldMatrix, localMatrix, node.worldMatrix);
    
    if (nodeImpl.billboarded) {
      var cameraMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      
      math.mat4.translate(cameraMatrix, pivot[0], pivot[1], pivot[2]);
      math.mat4.rotate(cameraMatrix, -math.toRad(camera.r[1] + 270), 0, 0, 1);
      math.mat4.rotate(cameraMatrix, math.toRad(camera.r[0] - 90), 0, 1, 0);
      math.mat4.translate(cameraMatrix, -pivot[0], -pivot[1], -pivot[2]);
      
      math.mat4.multMat(node.worldMatrix, cameraMatrix, node.worldMatrix);
    }
  },
  
  updateBoneTexture: function () {
    var bones = this.bones;
    var hwbones = this.hwbones;
    
     for (var i = 0, l = bones.length; i < l; i++) {
      var k = i * 16 + 16;
      var worldMatrix = this.nodes[bones[i].node].worldMatrix;
       
      // Setting each index manually is (or was at the time) faster than the Buffer:set method by a large margin
      hwbones[k + 0] = worldMatrix[0];
      hwbones[k + 1] = worldMatrix[1];
      hwbones[k + 2] = worldMatrix[2];
      hwbones[k + 3] = worldMatrix[3];
      hwbones[k + 4] = worldMatrix[4];
      hwbones[k + 5] = worldMatrix[5];
      hwbones[k + 6] = worldMatrix[6];
      hwbones[k + 7] = worldMatrix[7];
      hwbones[k + 8] = worldMatrix[8];
      hwbones[k + 9] = worldMatrix[9];
      hwbones[k + 10] = worldMatrix[10];
      hwbones[k + 11] = worldMatrix[11];
      hwbones[k + 12] = worldMatrix[12];
      hwbones[k + 13] = worldMatrix[13];
      hwbones[k + 14] = worldMatrix[14];
      hwbones[k + 15] = worldMatrix[15];
    }
    
    // Force GL to override its internal cache.
    // Without this, texture unit 1 wont get updated for other models.
    gl.bindTexture(null, 1);
    
    ctx.activeTexture(ctx.TEXTURE1);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, 4 + bones.length * 4, 1, ctx.RGBA, ctx.FLOAT, hwbones);
  },
  
  bind: function () {
    // Force GL to override its internal cache.
    // Without this, texture unit 1 wont get updated for other models.
    gl.bindTexture(null, 1);
    
    ctx.activeTexture(ctx.TEXTURE1);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    
    gl.setParameter("u_bones", 1);
    gl.setParameter("u_bone_size", this.boneFraction);
    gl.setParameter("u_pixel_size", this.texelFraction);
  }
};