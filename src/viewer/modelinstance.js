function ModelInstance(model, id, color, textureMap) {
  this.isInstance = true;
  this.model = model;
  this.id = id;
  
  this.source = model.source;
  this.visible = 1;
  
  this.worldMatrix = mat4.create();
  this.localMatrix = mat4.create();
  this.location = vec3.create();
  this.rotation = quat.create();
  this.scaling = vec3.fromValues(1, 1, 1);
  this.inverseScaling = vec3.fromValues(1, 1, 1);
  
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
  
  // Used for color picking
  this.color = color;
  
  // A queue of actions that were issued before the internal instance loaded, but require it to be loaded in order to run.
  // This queue will run automatically when the instance finishes loading.
  this.queue = [];
  
  // If the model is already ready, the onload message from setup() must be delayed, since this instance wouldn't be added to the cache yet.
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
    
    if (DEBUG_MODE) {
      console.log(this.instance);
    }
  },
  
  update: function (baseParticle, billboardedParticle) {
    if (this.ready) {
      this.instance.update(this, baseParticle, billboardedParticle);
    }
  },
  
  render: function (allowTeamColors) {
    if (this.ready && this.visible) {
      this.instance.render(this, allowTeamColors);
    }
  },
  
  renderEmitters: function (allowTeamColors) {
    if (this.ready && this.visible) {
      this.instance.renderEmitters(this, allowTeamColors);
    }
  },
  
  renderColor: function () {
    if (this.ready && this.visible) {
      this.instance.renderColor(this);
    }
  },
  
  getSource: function () {
    return this.model.source;
  },
  
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
  
  overrideTexture: function (source, path) {
    var textureMap = this.textureMap;
    
    if (path === "") {
      path = "\0";
    }
    
    textureMap[source] = path;
  },
  
  getTextureMap: function () {
    var data = {};
    var textureMap = this.textureMap;
    var keys = Object.keys(textureMap);
    var key;
      
    for (var i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      data[key] = textureMap[key];
    }
    
    return data;
  },
  
 recalculate: function () {
   mat4.fromRotationTranslationScale(this.localMatrix, this.rotation, this.location, this.scaling);
  },
  
  move: function (v) {
    vec3.add(this.location, this.location, v);
    this.recalculate();
  },
  
  setLocation: function (v) {
    vec3.copy(this.location, v);
    this.recalculate();
  },
  
  getLocation: function () {
    var v = this.location;
    
    return [v[0], v[1], v[2]];
  },
  
  rotate: function (q) {
    quat.multiply(this.rotation, this.rotation, q);
    this.recalculate();
  },
  
  setRotation: function (q) {
    quat.copy(this.rotation, q);
    this.recalculate();
  },
  
  getRotation: function () {
    var v = this.rotation;
    return [v[0], v[1], v[2], v[3]];
  },
  
  scale: function (n) {
    vec3.scale(this.scaling, this.scaling, n);
    vec3.inverse(this.inverseScaling, this.scaling);
    this.recalculate();
  },
  
  setScale: function (n) {
    vec3.set(this.scaling, n, n, n);
    vec3.inverse(this.inverseScaling, this.scaling);
    this.recalculate();
  },
  
  getScale: function () {
    return this.scaling[0];
  },
  
  // Get the transform of this instance.
  // If there is a parent, then it is parent * local matrix, otherwise just the local matrix.
  getTransform: function (objects) {
    var worldMatrix = this.worldMatrix;
    var parent = this.parent;
    
    mat4.identity(worldMatrix);
    
    if (parent) {
      if (this.attachment !== -1) {
        var attachment = parent.getAttachment(this.attachment);
        
        // This check avoids errors when the model still didn't finish loading, and thus can't return any real attachment object
        if (attachment) {
          mat4.multiply(worldMatrix, worldMatrix, attachment.getTransform());
        }
      } else {
        mat4.multiply(worldMatrix, worldMatrix, parent.getTransform());
      }
      
      // Scale by the inverse of the parent to avoid carrying over scales through the hierarchy
      mat4.scale(worldMatrix, worldMatrix, parent.inverseScaling);
      
      // To avoid the 90 degree rotations applied to M3 models
      if (parent.format !== "MDLX") {
        mat4.rotate(worldMatrix, worldMatrix, -Math.PI / 2, zAxis);
      }
    }
    
    mat4.multiply(worldMatrix, worldMatrix, this.localMatrix);
    
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
    // M3
    this.teamColor = id;
    
    // MDX
    var idString = ((id < 10) ? "0" + id : id);
    
    this.overrideTexture("replaceabletextures/teamcolor/teamcolor00.blp", urls.mpqFile("ReplaceableTextures/TeamColor/TeamColor" + idString + ".blp"));
    this.overrideTexture("replaceabletextures/teamglow/teamglow00.blp", urls.mpqFile("ReplaceableTextures/TeamGlow/TeamGlow" + idString + ".blp"));
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
    var location = this.location;
    var rotation = this.rotation;
    var scale = this.scaling;
    
    // This code avoids saving instance overrides that match the model's texture map.
    // For example, when the client overrides a texture and then sets it back to the original value.
    var textureMap = {};
    var modelTextureMap = this.model.getTextureMap();
    var key, keys = Object.keys(this.textureMap);
    
    for (var i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      // The second condition is to avoid saving team color/glow overrides, since they are saved via the team ID
      if (this.textureMap[key] !== modelTextureMap[key] && key.endsWith("00.png")) {
        textureMap[key] = this.textureMap[key];
      }
    }
    
    // Rotate Starcraft 2 models back to zero to avoid rotating them twice when loading the scene
    if (this.format !== "MDLX") {
      rotation = quat.multiply([], rotation, [0, 0, 0.7071067811865476, -0.7071067811865476]);
      scale /= 100;
    }
    
    // To avoid silly numbers like 1.0000000000000002
    rotation = math.floatPrecisionArray(rotation, 3);
    
    return [
      this.id,
      this.model.id,
      this.sequence,
      this.sequenceLoopMode,
      // For some reason, when typed arrays are JSON stringified they change to object notation rather than array notation
      [location[0], location[1], location[2]],
      [rotation[0], rotation[1], rotation[2], rotation[3]],
      scale[0],
      this.parentId,
      this.attachment,
      this.teamColor,
      textureMap
    ];
  },
  
  fromJSON: function (object) {
    this.setSequence(object[2]);
    this.setSequenceLoopMode(object[3]);
    this.setLocation(object[4]);
    this.setRotation(object[5]);
    this.setScale(object[6]);
    this.setTeamColor(object[9]);
    
    var textureMap = object[10];
    var key, keys = Object.keys(textureMap);
    
    for (var i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      this.overrideTexture(key, textureMap[key]);
    }
  }
};