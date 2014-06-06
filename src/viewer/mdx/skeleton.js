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
  
  // To avoid heap allocations
  this.localMatrix = mat4.create();
  this.locationVec = vec3.create();
  this.scaleVec = vec3.create();
  this.rotationQuat = quat.create();
}

Skeleton.prototype = {
  update: function (sequence, frame, counter, instance) {
    var nodes = this.nodes;
    var hierarchy = this.hierarchy;
    var root = nodes[0].worldMatrix;
    
    // The root is always at index 0, since it's injected by the parser
    mat4.identity(root);
    mat4.multiply(root, root, instance.getTransform());
    
    for (var i = 1, l = hierarchy.length; i < l; i++) {
      this.updateNode(nodes[hierarchy[i]], sequence, frame, counter);
    }
      
    this.updateBoneTexture();
  },
  
  updateNode: function (node, sequence, frame, counter) {
    var nodeImpl = node.nodeImpl;
    var pivot = node.pivot;
    var negativePivot = node.negativePivot;
    var localMatrix = this.localMatrix;
    var translation = getSDValue(sequence, frame, counter, nodeImpl.sd.translation, defaultTransformations.translation, this.locationVec);
    var rotation = getSDValue(sequence, frame, counter, nodeImpl.sd.rotation, defaultTransformations.rotation, this.rotationQuat);
    var scale = getSDValue(sequence, frame, counter, nodeImpl.sd.scaling, defaultTransformations.scaling, this.scaleVec);
    
    mat4.fromRotationTranslationScaleOrigin(localMatrix, rotation, translation, scale, pivot);
    
    var parent = this.nodes[node.parentId];
    
    mat4.multiply(node.worldMatrix, parent.worldMatrix, localMatrix);
    
    if (nodeImpl.billboarded) {
      // TODO optimize these matrix operations
      
      mat4.identity(localMatrix);
      
      mat4.translate(localMatrix, localMatrix, pivot);
      
      if (instanceCamera[1] === -1) {
        // -270 degrees
        mat4.rotate(localMatrix, localMatrix, -camera.r[1] - 4.71238, zAxis);
        // -90 degrees
        mat4.rotate(localMatrix, localMatrix, camera.r[0] - 1.57079, yAxis);
      } else {
        // Nothing I do here works...........
        //mat4.rotate(localMatrix, localMatrix, -1.57079, yAxis);
        //mat4.multiply(localMatrix, inverseCameraRotation, localMatrix);
      }
      
      mat4.translate(localMatrix, localMatrix, negativePivot);
      
      mat4.multiply(node.worldMatrix, node.worldMatrix, localMatrix);
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