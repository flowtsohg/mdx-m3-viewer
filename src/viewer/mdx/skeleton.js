// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Skeleton(model) {
  var i, l;
  var pivots = model.pivots;
  var nodes = model.nodes;
  var bones = model.bones;
  
  this.nodes = [];
  
  for (i = 0, l = nodes.length; i < l; i++) {
    this.nodes[i] = new ShallowNode(nodes[i]);
  }
  
  this.root = this.nodes[0];
  this.root.children = this.setup(this.root);
  
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
}

Skeleton.prototype = {
  setup: function (parent) {
    var cildren = [];
      
    for (var i = this.nodes.length; i--;) {
      var node = this.nodes[i];
      
      if (node.parentId === parent.objectId) {
        node.children = this.setup(node);
        node.parent = parent;
        
        cildren.push(node);
      }
    }
    
    return cildren;
  },
  
  update: function (sequence, frame, counter, instance) {
    math.mat4.makeIdentity(this.root.worldMatrix);
    
    math.mat4.multMat(this.root.worldMatrix, instance.getTransform(), this.root.worldMatrix);
    
    this.updateNodes(this.root, sequence, frame, counter);
    this.updateBoneTexture();
  },
  
  updateNodes: function (parent, sequence, frame, counter) {
    for (var i = 0, l = parent.children.length; i < l; i++) {
      var node = parent.children[i];
      
      this.updateNode(node, sequence, frame, counter);
      this.updateNodes(node, sequence, frame, counter);
    }
  },
  
  updateBoneTexture: function () {
     for (var i = 0, l = this.bones.length; i < l; i++) {
      var k = i * 16 + 16;
      var worldMatrix = this.nodes[this.bones[i].node].worldMatrix;
       
      // Setting each index manually is (or was at the time) faster than the Buffer:set method by a large margin
      this.hwbones[k + 0] = worldMatrix[0];
      this.hwbones[k + 1] = worldMatrix[1];
      this.hwbones[k + 2] = worldMatrix[2];
      this.hwbones[k + 3] = worldMatrix[3];
      this.hwbones[k + 4] = worldMatrix[4];
      this.hwbones[k + 5] = worldMatrix[5];
      this.hwbones[k + 6] = worldMatrix[6];
      this.hwbones[k + 7] = worldMatrix[7];
      this.hwbones[k + 8] = worldMatrix[8];
      this.hwbones[k + 9] = worldMatrix[9];
      this.hwbones[k + 10] = worldMatrix[10];
      this.hwbones[k + 11] = worldMatrix[11];
      this.hwbones[k + 12] = worldMatrix[12];
      this.hwbones[k + 13] = worldMatrix[13];
      this.hwbones[k + 14] = worldMatrix[14];
      this.hwbones[k + 15] = worldMatrix[15];
    }
    
    ctx.activeTexture(ctx.TEXTURE1);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, 4 + this.bones.length * 4, 1, ctx.RGBA, ctx.FLOAT, this.hwbones);
  },
  
  updateNode: function (node, sequence, frame, counter) {
    var nodeImpl = node.nodeImpl;
    var pivot = node.pivot;
    var translation = getSDValue(sequence, frame, counter, nodeImpl.sd.translation, [0, 0, 0]);
    var rotation = getSDValue(sequence, frame, counter, nodeImpl.sd.rotation, [0, 0, 0, 1]);
    var scaling = getSDValue(sequence, frame, counter, nodeImpl.sd.scaling, [1, 1, 1]);
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
    
    if (scaling[0] !== 1 || scaling[1] !== 1 || scaling[2] !== 1) {
      math.mat4.translate(localMatrix, pivot[0], pivot[1], pivot[2]);
      math.mat4.scale(localMatrix, scaling[0], scaling[1], scaling[2]);
      math.mat4.translate(localMatrix, -pivot[0], -pivot[1], -pivot[2]);
    }
    
    math.mat4.multMat(node.parent.worldMatrix, localMatrix, node.worldMatrix);
    
    if (node.billboarded) {
      var p = pivot;
      var cameraMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      
      math.mat4.translate(cameraMatrix, p[0], p[1], p[2]);
      math.mat4.rotate(cameraMatrix, -math.toRad(camera.r[1] + 270), 0, 0, 1);
      math.mat4.rotate(cameraMatrix, math.toRad(camera.r[0] - 90), 0, 1, 0);
      math.mat4.translate(cameraMatrix, -p[0], -p[1], -p[2]);
      
      math.mat4.multMat(node.worldMatrix, cameraMatrix, node.worldMatrix);
    }
  },
  
  bind: function () {
    ctx.activeTexture(ctx.TEXTURE1);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    
    gl.setParameter("u_bones", 1);
    gl.setParameter("u_bone_size", this.boneFraction);
    gl.setParameter("u_pixel_size", this.texelFraction);
  }
};