var defaultTransformations = {
  translation: [0, 0, 0],
  rotation: [0, 0, 0, 1],
  scaling: [1, 1, 1]
};

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
  this.matrixFraction = this.texelFraction * 4;
  
  ctx.activeTexture(ctx.TEXTURE15);
  ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.boneTextureSize, 1, 0, ctx.RGBA, ctx.FLOAT, null);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
  
  this.localMatrix = math.mat4.create();
  this.rotationMatrix = math.mat4.create();
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
    var localMatrix = this.localMatrix;
    var rotationMatrix = this.rotationMatrix;
    var translation = getSDValue(sequence, frame, counter, nodeImpl.sd.translation, defaultTransformations.translation);
    var rotation = getSDValue(sequence, frame, counter, nodeImpl.sd.rotation, defaultTransformations.rotation);
    var scale = getSDValue(sequence, frame, counter, nodeImpl.sd.scaling, defaultTransformations.scaling);
    
    math.mat4.makeIdentity(localMatrix);
    
    if (translation[0] !== 0 || translation[1] !== 0 || translation[2] !== 0) {
      math.mat4.translate(localMatrix, translation[0], translation[1], translation[2]);
    }
    
    if (rotation[0] !== 0 || rotation[1] !== 0 || rotation[2] !== 0 || rotation[3] !== 1) {
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
      math.mat4.makeIdentity(localMatrix);
      
      math.mat4.translate(localMatrix, pivot[0], pivot[1], pivot[2]);
      math.mat4.rotate(localMatrix, -math.toRad(camera.r[1] + 270), 0, 0, 1);
      math.mat4.rotate(localMatrix, math.toRad(camera.r[0] - 90), 0, 1, 0);
      math.mat4.translate(localMatrix, -pivot[0], -pivot[1], -pivot[2]);
      
      math.mat4.multMat(node.worldMatrix, localMatrix, node.worldMatrix);
    }
  },
  
  updateBoneTexture: function () {
    var bones = this.bones;
    var hwbones = this.hwbones;
    var nodes = this.nodes;
    
    for (var i = 0, l = bones.length; i < l; i++) {
      hwbones.set(nodes[bones[i].node].worldMatrix, i * 16 + 16);
    }
    
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, 4 + bones.length * 4, 1, ctx.RGBA, ctx.FLOAT, hwbones);
  },
  
  bind: function (shader) {
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    
    ctx.uniform1i(shader.variables.u_boneMap, 15);
    ctx.uniform1f(shader.variables.u_matrix_size, this.matrixFraction);
    ctx.uniform1f(shader.variables.u_texel_size, this.texelFraction);
  }
};