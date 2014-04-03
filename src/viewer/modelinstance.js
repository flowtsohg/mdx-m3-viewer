
function ModelInstance(model) {
  this.isInstance = true;
  this.model = model;
  this.localMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  this.position = [0, 0, 0];
  this.rotation = [0, 0, 0, 1];
  this.scaling = 1;
  
  // This is a local texture map that can override the one owned by the model.
  // This way, every instance can have different textures.
  this.textureMap = [];
  
  // A queue of actions that were issued before the internal instance loaded, but require it to be loaded in order to run.
  // This queue will run automatically when the instance finishes loading.
  this.queue = [];
  
  // Request the setup function to be called by the model when it can.
  // If the model is loaded, setup runs instantly, otherwise it runs when the model finishes loading.
  model.setupInstance(this);
}

ModelInstance.prototype = {
  // Setup the internal instance using the internal model implementation
  setup: function (model, format) {
    this.format = format;
    
    if (format === "MDLX") {
      this.instance = new Mdx.ModelInstance(model);
    } else {
      this.instance = new M3.ModelInstance(model);
      
      // Transform to match the direction and size of MDX models
      this.rotate([0, 0, 90]);
      this.scale(100);
    }
    
    this.ready = true;
    
    for (var i = 0, l = this.queue.length; i < l; i++) {
      var action = this.queue[i];
      
      this[action[0]].apply(this, action[1]);
    }
  },
  
  update: function () {
    if (this.ready) {
      this.instance.update(this);
    }
  },
  
  render: function () {
    if (this.ready) {
      this.instance.render(this);
    }
  },
  
  // Parent in this context is any object with a getTransform method that returns a matrix.
  // Attachment is an optional attachment id that will be used from that parent, if it has a getAttachment method.
  setParent: function (parent, attachment) {
    this.parent = parent;
    this.attachment = attachment;
  },
  
  overrideTexture: function (path, newpath, onload, onerror, onprogress) {
    var source;
    
    path = path.toLowerCase();
    newpath = newpath.toLowerCase();
    
    // Parse the source as an absolute path, an MPQ path, or an ID
    if (newpath.startsWith("http://")) {
      source = newpath;
    } else if (newpath.match(/\.(?:mdx|m3|blp|dds)$/)) {
      source = url.mpqFile(newpath);
    } else {
      source = url.customTexture(newpath);
    }
    
    this.textureMap[path] = gl.newTexture(newpath, source, false, false, onload, onerror, onprogress);
  },
  
 recalcuate: function () {
   math.mat4.makeIdentity(this.localMatrix);
   
    if (this.position[0] !== 0 || this.position[1] !== 0 || this.position[2] !== 0) {
      math.mat4.translate(this.localMatrix, this.position[0], this.position[1], this.position[2]);
    }
    
    if (this.rotation[0] !== 0 || this.rotation[1] !== 0 || this.rotation[2] !== 0 || this.rotation[3] !== 1) {
      math.mat4.rotateQ(this.localMatrix, this.rotation);
    }
    
    if (this.scaling !== 1) {
      math.mat4.scale(this.localMatrix, this.scaling, this.scaling, this.scaling);
    }
  },
  
  move: function (v) {
    math.vec3.add(this.position, v, this.position);
    this.recalcuate();
  },
  
  setPosition: function (v) {
    math.vec3.setFromArray(this.position, v);
    this.recalcuate();
  },
  
  rotateQ: function (q) {
    math.quaternion.concat(this.rotation, q, this.rotation);
    this.recalcuate();
  },
  
  setRotationQ: function (q) {
    math.quaternion.setFromArray(this.rotation, q);
    this.recalcuate();
  },
  
  rotate: function (v) {
    math.quaternion.concat(this.rotation, math.quaternion.fromAngles(v[0], v[1], v[2], []), this.rotation);
    this.recalcuate();
  },
  
  setRotation: function (v) {
    math.quaternion.setFromArray(this.rotation, math.quaternion.fromAngles(v[0], v[1], v[2], []));
    this.recalcuate();
  },
  
  scale: function (n) {
    this.scaling *= n;
    this.recalcuate();
  },
  
  setScale: function (n) {
    this.scaling = n;
    
    // The base scale for M3 models is 100
    if (this.format !== "MDLX") {
      this.scaling *= 100;
    }
    
    this.recalcuate();
  },
  
  // Get the transform of this instance.
  // If there is a parent, then it is parent * local matrix, otherwise just the local matrix.
  getTransform: function () {
    var worldMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    var parent = this.parent;
    
    if (parent) {
      var invscaling = 1 / parent.scaling;
      
      if (this.attachment) {
        var attachment = parent.getAttachment(this.attachment);
        
        // This check avoids errors when the model still didn't finish loading, and thus can't return any real attachment object
        if (attachment) {
          math.mat4.multMat(worldMatrix, attachment.getTransform(), worldMatrix);
        }
      } else {
        math.mat4.multMat(worldMatrix, parent.getTransform(), worldMatrix);
      }
      
      // Scale by the inverse of the parent to avoid carying over scales through the hierarchy
      math.mat4.scale(worldMatrix, invscaling, invscaling, invscaling);
      
      // To avoid the 90 degree rotations applied to M3 models
      if (parent.format !== "MDLX") {
        math.mat4.rotate(worldMatrix, -Math.PI / 2, 0, 0, 1);
      }
    }
    
    math.mat4.multMat(worldMatrix, this.localMatrix, worldMatrix);
    
    return worldMatrix;
  },
  
  getAttachment: function (id) {
    if (this.ready) {
      return this.instance.getAttachment(id);
    }
  },
  
  setAnimation: function (id) {
    if (this.ready) {
      this.instance.setAnimation(id);
    } else {
      this.queue.push(["setAnimation", [id]])
    }
  },
  
  setAnimationLoop: function (mode) {
    if (this.ready) {
      this.instance.setAnimationLooping(mode);
    } else {
      this.queue.push(["setAnimationLoop", [mode]])
    }
  }
};