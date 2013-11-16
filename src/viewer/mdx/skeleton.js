// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Skeleton(parser, model) {
  var i, l;
  var pivots = parser.pivotPointChunk.points;
  
  this.model = model;
  this.nodes = parser.nodes;
  
  for (i = 0, l = parser.nodes.length; i < l; i++) {
    var node = parser.nodes[i];
    
    node.pivot = pivots[node.objectId] || [0, 0, 0];
    node.worldMatrix = [];
  }
  
  this.bones = [];
  
  if (parser.boneChunk) {
    var bones = parser.boneChunk.bones;
    
    for (i = 0, l = bones.length; i < l; i++) {
      this.bones.push(bones[i].node);
    }
  }
    
  if (RENDER_MODE > 0) {
    this.hwbones = new Float32Array(16 + (16 * this.bones.length));
  }
  
  if (RENDER_MODE === 2) {
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
  
  this.root = {objectId: 4294967295};
  this.root.children = this.setup(parser.nodes, this.root);
}

Skeleton.prototype = {
  setup: function (nodes, parent) {
    var cildren = [];
      
    for (var i = nodes.length; i--;) {
      var node = nodes[i];
      
      if (node.parentId === parent.objectId && node.objectId !== 4294967295) {
        node.children = this.setup(nodes, node);
        node.parent = parent;
        
        cildren.push(node);
      }
    }
    
    return cildren;
  },
  
  update: function () {
    this.updateNodes(this.root);
    
    if (RENDER_MODE > 0) {
      this.updateHW();
    }
  },
  
  updateNodes: function (parent) {
    for (var i = 0, l = parent.children.length; i < l; i++) {
      var node = parent.children[i];
      
      this.updateNode(node);
      this.updateNodes(node);
    }
  },
  
  updateHW: function () {
     for (var i = 0, l = this.bones.length; i < l; i++) {
      var k = i * 16 + 16;
       
      this.hwbones[k + 0] = this.bones[i].worldMatrix[0];
      this.hwbones[k + 1] = this.bones[i].worldMatrix[1];
      this.hwbones[k + 2] = this.bones[i].worldMatrix[2];
      this.hwbones[k + 3] = this.bones[i].worldMatrix[3];
      this.hwbones[k + 4] = this.bones[i].worldMatrix[4];
      this.hwbones[k + 5] = this.bones[i].worldMatrix[5];
      this.hwbones[k + 6] = this.bones[i].worldMatrix[6];
      this.hwbones[k + 7] = this.bones[i].worldMatrix[7];
      this.hwbones[k + 8] = this.bones[i].worldMatrix[8];
      this.hwbones[k + 9] = this.bones[i].worldMatrix[9];
      this.hwbones[k + 10] = this.bones[i].worldMatrix[10];
      this.hwbones[k + 11] = this.bones[i].worldMatrix[11];
      this.hwbones[k + 12] = this.bones[i].worldMatrix[12];
      this.hwbones[k + 13] = this.bones[i].worldMatrix[13];
      this.hwbones[k + 14] = this.bones[i].worldMatrix[14];
      this.hwbones[k + 15] = this.bones[i].worldMatrix[15];
    }
    
    if (RENDER_MODE === 2) {
      ctx.activeTexture(ctx.TEXTURE1);
      ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
      ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, 4 + this.bones.length * 4, 1, ctx.RGBA, ctx.FLOAT, this.hwbones);
    }
  },
  
  updateNode: function (node) {
    var pivot = node.pivot;
    var translation = getTrack(node.tracks.translation, [0, 0, 0], this.model);
    var rotation = getTrack(node.tracks.rotation, [0, 0, 0, 1], this.model);
    var scaling = getTrack(node.tracks.scaling, [1, 1, 1], this.model);
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
    
    if (node.parent.objectId !== 4294967295) {
      math.mat4.multMat(node.parent.worldMatrix, localMatrix, node.worldMatrix);
    } else {
      node.worldMatrix = localMatrix;
    }
    
    if (node.billboarded) {
      var p = pivot;
      var cameraMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      
      math.mat4.translate(cameraMatrix, p[0], p[1], p[2]);
      math.mat4.rotate(cameraMatrix, -math.toRad(camera.r[1] + 270), 0, 0, 1);
      math.mat4.rotate(cameraMatrix, math.toRad(camera.r[0] - 90), 0, 1, 0);
      math.mat4.translate(cameraMatrix, -p[0], -p[1], -p[2]);
      /*
      var quaternion = [];
      var quaternionMatrix = [];
      var nodeMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      
      math.mat4.decompose(node.worldMatrix, [], quaternion, []);
      
      math.quaternion.toRotationMatrix4(quaternion, quaternionMatrix);
      
      math.mat4.translate(nodeMatrix, p[0], p[1], p[2]);
      math.mat4.multMat(nodeMatrix, quaternionMatrix, nodeMatrix);
      math.mat4.translate(nodeMatrix, -p[0], -p[1], -p[2]);
      
      var finalMatrix = [];
      
      //math.mat4.multMat(nodeMatrix, cameraMatrix, finalMatrix);
      */
      math.mat4.multMat(node.worldMatrix, cameraMatrix, node.worldMatrix);
    }
  },
  
  bind: function () {
    if (RENDER_MODE === 2) {
      ctx.activeTexture(ctx.TEXTURE1);
      ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
      
      gl.setParameter("u_bones", 1);
      gl.setParameter("u_bone_size", this.boneFraction);
      gl.setParameter("u_pixel_size", this.texelFraction);
    } else if (RENDER_MODE === 1) {
      gl.setParameter("u_bones", this.hwbones);
    }
  }
};