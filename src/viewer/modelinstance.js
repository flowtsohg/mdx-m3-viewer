function ModelInstance(model, id, textureMap) {
  this.isInstance = true;
  this.model = model;
  this.id = id;
  
  this.source = model.source;
  this.visible = 1;
  
  this.localMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  this.location = [0, 0, 0];
  this.rotation = [0, 0, 0, 1];
  this.scaling = 1;
  
  this.parent = null;
  this.parentId = -1;
  this.attachment = -1;
  
  this.teamColor = 0;
  this.sequence = -1;
  this.sequenceLoopMode = 0;
  
  // This is a local texture map that can override the one owned by the model.
  // This way, every instance can have different textures.
  this.textureMap = {};
    
  if (textureMap) {
    var keys = Object.keys(textureMap);
    
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      
      this.overrideTexture(key, textureMap[key]);
    }
  }
  
  // A queue of actions that were issued before the internal instance loaded, but require it to be loaded in order to run.
  // This queue will run automatically when the instance finishes loading.
  this.queue = [];
  
  // If the model is already ready, the onload message from setup() must be delayed, since this instance wouldn't be added to the cache yet.
  // 
  if (model.ready) {
    this.delayOnload = true;
  }
  
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
      this.rotate([0, 0, 0.7071067811865476, 0.7071067811865476]);
      this.scale(100);
    }
    
    this.ready = true;
    
    for (var i = 0, l = this.queue.length; i < l; i++) {
      var action = this.queue[i];
      
      this[action[0]].apply(this, action[1]);
    }
    
    this.recalculate();
    
    if (!this.delayOnload) {
      onload(this);
    }
  },
  
  update: function () {
    if (this.ready) {
      this.instance.update(this);
    }
  },
  
  render: function (allowTeamColors) {
    if (this.ready && this.visible) {
      this.instance.render(this, allowTeamColors);
    }
  },
  
  // Return the source of the model that this instance points to.
  getSource: function () {
    return this.model.source;
  },
  
  // Attachment is an optional attachment id that will be used from that parent, if it has a getAttachment method.
  setParent: function (parent, attachment) {
    this.parent = parent;
    
    if (!parent) {
      this.parentId = -1;
      this.attachment = -1;
    } else {
      this.parentId = parent.id;
      this.attachment = attachment;
    }
  },
  
  getParent: function () {
    return [this.parentId, this.attachment];
  },
  
  overrideTexture: function (path, newpath) {
    var source;
    
    if (newpath) {
      path = path.toLowerCase();
      newpath = newpath.toLowerCase();
      
      this.textureMap[path] = gl.newTexture(newpath, newpath);
    } else {
      // This can't be set to null, because then it wont be picked as an override when the models check the instance texture map.
      // Instead it is set to -1, and the texture binder sets the texture to null if it's equal to -1 (see before.js).
      this.textureMap[path] = -1;
    }
  },
  
  getTextureMap: function () {
    var data = {};
    var keys = Object.keys(this.textureMap);
    
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      
      data[key] = this.textureMap[key].name;
    }
    
    return data;
  },
  
 recalculate: function () {
   var location = this.location;
   var rotation = this.rotation;
   var scale = this.scaling;
   var localMatrix = this.localMatrix;
   
   math.mat4.makeIdentity(localMatrix);
   
    if (location[0] !== 0 || location[1] !== 0 || location[2] !== 0) {
      math.mat4.translate(localMatrix, location[0], location[1], location[2]);
    }
    
    if (rotation[0] !== 0 || rotation[1] !== 0 || rotation[2] !== 0 || rotation[3] !== 1) {
      math.mat4.rotateQ(localMatrix, rotation);
    }
      
    if (scale !== 1) {
      math.mat4.scale(localMatrix, scale, scale, scale);
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
  getTransform: function (objects) {
    var worldMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    var parent = this.parent;
    
    if (parent) {
      var invscaling = 1 / parent.scaling;
      
      if (this.attachment !== -1) {
        var attachment = parent.getAttachment(this.attachment);
        
        // This check avoids errors when the model still didn't finish loading, and thus can't return any real attachment object
        if (attachment) {
          math.mat4.multMat(worldMatrix, attachment.getTransform(), worldMatrix);
        }
      } else {
        math.mat4.multMat(worldMatrix, parent.getTransform(), worldMatrix);
      }
      
      // Scale by the inverse of the parent to avoid carrying over scales through the hierarchy
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
      this.instance.setSequenceLoopMode(mode);
    } else {
      this.queue.push(["setSequenceLoopMode", [mode]])
    }
  },
  
  getSequenceLoopMode: function () {
    return this.sequenceLoopMode;
  },
  
  setTeamColor: function (id) {
    this.teamColor = id;
    
    if (this.format === "MDLX") {
      var idString = ((id < 10) ? "0" + id : id);
      
      this.overrideTexture("replaceabletextures/teamcolor/teamcolor00.blp", "replaceabletextures/teamcolor/teamcolor" + idString + ".blp");
      this.overrideTexture("replaceabletextures/teamglow/teamglow00.blp", "replaceabletextures/teamglow/teamglow" + idString + ".blp");
    }
  },
  
  getTeamColor: function () {
    return this.teamColor;
  },
  
  getSequences: function () {
    if (this.ready) {
      return this.model.getSequences();
    }
    
    return [];
  },
  
  getAttachments: function () {
    if (this.ready) {
      return this.model.getAttachments();
    }
    
    return [];
  },
  
  getCameras: function () {
    if (this.ready) {
      return this.model.getCameras();
    }
    
    return [];
  },
  
  setVisibility: function (b) {
    this.visible = b;
  },
  
  getVisibility: function () {
    return this.visible;
  },
  
  getInfo: function () {
    return {
      modelInfo: this.model.getInfo(),
      visible: this.visible,
      sequence: this.getSequence(),
      sequenceLoopMode: this.getSequenceLoopMode(),
      location: this.getLocation(),
      rotation: this.getRotation(),
      scale: this.getScale(),
      parent: this.getParent(),
      teamColor: this.getTeamColor(),
      textureMap: this.getTextureMap()
    };
  },
  
  toJSON: function () {
    var rotation = this.rotation;
    var scale = this.scaling;
    
    if (this.format !== "MDLX") {
      rotation = math.quaternion.concat(rotation, [0, 0, 0.7071067811865476, -0.7071067811865476], []);
      scale /= 100;
    }
    
    // To avoid silly numbers like 1.0000000000000002
    rotation = math.quaternion.floatPrecision(rotation, 3);
    
    return [
      1, // 0 for Model, 1 for ModelInstance
      this.model.id,
      this.visible,
      this.sequence,
      this.sequenceLoopMode,
      this.location,
      rotation,
      scale,
      this.parentId,
      this.attachment,
      this.teamColor,
      this.textureMap
    ];
  },
  
  fromJSON: function (object) {
    this.visible = object[2];
    this.setSequence(object[3]);
    this.setSequenceLoopMode(object[4]);
    this.setLocation(object[5]);
    this.setRotation(object[6]);
    this.setScale(object[7]);
    // This can't be used from inside ModelInstance, because it requires external knowledge (the instance cache).
    //this.setParent(object[8], object[9]);
    this.setTeamColor(object[10]);
  }
};