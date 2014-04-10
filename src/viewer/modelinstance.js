
function ModelInstance(model) {
  this.isInstance = true;
  this.model = model;
  
  this.localMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  this.location = [0, 0, 0];
  this.rotation = [0, 0, 0, 1];
  this.scaling = 1;
  
  this.teamId = 0;
  this.sequence = -1;
  this.sequenceLoopMode = 0;
  
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
    }
    
    this.ready = true;
    
    for (var i = 0, l = this.queue.length; i < l; i++) {
      var action = this.queue[i];
      
      this[action[0]].apply(this, action[1]);
    }
    
    this.recalculate();
  },
  
  update: function () {
    if (this.ready) {
      this.instance.update(this);
    }
  },
  
  render: function (allowTeamColors) {
    if (this.ready) {
      // To disable team colors, override the instance team ID with one that will point to a pure black color
      this.instance.render(this, allowTeamColors ? this.teamId : 13);
    }
  },
  
  // Return the source of the model that this instance points to.
  getSource: function () {
    return this.model.source;
  },
  
  // Parent in this context is any object with a getTransform method that returns a matrix.
  // Attachment is an optional attachment id that will be used from that parent, if it has a getAttachment method.
  setParent: function (parent, attachment) {
    this.parent = parent;
    this.attachment = attachment;
  },
  
  getParent: function () {
    var data = [];
    
    if (this.parent) {
      data[0] = this.parent;
    }
    
    if (this.attachment) {
      data[1] = this.attachment;
    }
    
    return data;
  },
  
  overrideTexture: function (path, newpath) {
    var source;
    
    path = path.toLowerCase();
    newpath = newpath.toLowerCase();
    
    // Parse the source as an absolute path, an MPQ path, or an ID
    if (newpath.startsWith("http://")) {
      source = newpath;
    } else if (newpath.match(/\.(?:mdx|m3|blp|dds)$/)) {
      source = urls.mpqFile(newpath);
    } else {
      source = urls.customTexture(newpath);
    }
    
    this.textureMap[path] = gl.newTexture(newpath, source);
  },
  
  getTextureMap: function () {
    var data = [];
    var keys = Object.keys(this.textureMap);
    
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      
      data[i] = [key, this.textureMap[key].name];
    }
    
    return data;
  },
  
 recalculate: function () {
   var scale = this.scaling;
   
   math.mat4.makeIdentity(this.localMatrix);
   
    if (this.location[0] !== 0 || this.location[1] !== 0 || this.location[2] !== 0) {
      math.mat4.translate(this.localMatrix, this.location[0], this.location[1], this.location[2]);
    }
    
    if (this.rotation[0] !== 0 || this.rotation[1] !== 0 || this.rotation[2] !== 0 || this.rotation[3] !== 1) {
      math.mat4.rotateQ(this.localMatrix, this.rotation);
    }
    
    // The base scale of Starcraft 2 models is approximately 1/100 of Warcraft 3 models.
    if (this.format === "43DM") {
      scale *= 100;
    }
      
    if (scale !== 1) {
      math.mat4.scale(this.localMatrix, scale, scale, scale);
    }
  },
  
  move: function (v) {
    math.vec3.add(this.location, v, this.location);
    this.recalculate();
  },
  
  setLocation: function (v) {
    math.vec3.setFromArray(this.location, v);
    this.recalculate();
  },
  
  getLocation: function () {
    var v = this.location;
    
    return [v[0], v[1], v[2]];
  },
  
  rotate: function (q) {
    math.quaternion.concat(this.rotation, q, this.rotation);
    this.recalculate();
  },
  
  setRotation: function (q) {
    math.quaternion.setFromArray(this.rotation, q);
    this.recalculate();
  },
  
  getRotation: function () {
    var v = this.rotation;
    
    return [v[0], v[1], v[2], v[3]];
  },
  
  scale: function (n) {
    this.scaling *= n;
    this.recalculate();
  },
  
  setScale: function (n) {
    this.scaling = n;
    this.recalculate();
  },
  
  getScale: function () {
    return this.scaling;
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
  
  setSequence: function (id) {
    this.sequence = id;
    
    if (this.ready) {
      this.instance.setSequence(id);
    } else {
      this.queue.push(["setSequence", [id]])
    }
  },
  
  getSequence: function () {
    return this.sequence;
  },
  
  setSequenceLoopMode: function (mode) {
    this.sequenceLoopMode = mode;
    
    if (this.ready) {
      this.instance.sequenceLoopMode(mode);
    } else {
      this.queue.push(["sequenceLoopMode", [mode]])
    }
  },
  
  getSequenceLoopMode: function () {
    return this.sequenceLoopMode;
  },
  
  setTeamColor: function (id) {
    this.teamId = id;
  },
  
  getTeamColor: function () {
    return this.teamId;
  },
  
  getInfo: function () {
    return {
      location: this.getLocation(),
      rotatrion: this.getRotation(),
      scaling: this.getScale(),
      teamId: this.getTeamColor(),
      sequence: this.getSequence(),
      sequenceLoopMode: this.getSequenceLoopMode(),
      modelInfo: this.model.getInfo()
    };
  }
};