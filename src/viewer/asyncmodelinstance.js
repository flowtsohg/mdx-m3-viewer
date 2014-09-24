function AsyncModelInstance(asyncModel, id, color, textureMap) {
  this.ready = false;
  this.fileType = asyncModel.fileType;
  this.handler = AsyncModelInstance.handlers[asyncModel.fileType];
  
  if (this.handler) {
    this.isInstance = true;
    this.asyncModel = asyncModel;
    this.id = id;
    
    this.source = asyncModel.source;
    this.visible = 1;
    
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
    
    // Use the Async mixin
    this.useAsync();
    
    // Use the Spatial mixin
    this.useSpatial();
    
    // If the model is already ready, the onload message from setup() must be delayed, since this instance wouldn't be added to the cache yet.
    if (asyncModel.ready) {
      this.delayOnload = true;
    }
    
    // Request the setup function to be called by the model when it can.
    // If the model is loaded, setup runs instantly, otherwise it runs when the model finishes loading.
    asyncModel.setupInstance(this);
  } else {
    console.log("AsyncModelInstance: No handler for file type " + asyncModel.fileType);
  }
}

AsyncModelInstance.handlers = {
  "mdx": Mdx.ModelInstance,
  "m3": M3.ModelInstance
};

AsyncModelInstance.prototype = {
  // Setup the internal instance using the internal model implementation
  setup: function (model, fileType) {
    this.fileType = fileType;
    this.handler = AsyncModelInstance.handlers[fileType];
    
    this.instance = new this.handler(model);
    
    if (this.fileType === "m3") {
      // Transform to match the direction and size of MDX models
      this.rotate([0, 0, 0.7071067811865476, 0.7071067811865476]);
      this.scale(100);
    }
    
    this.ready = true;
    
    this.runAsyncActions();
    
    this.recalculateTransformation();
    
    if (!this.delayOnload) {
      onload(this);
    }
    
    if (DEBUG_MODE) {
      console.log(this.instance);
    }
  },
  
  update: function (context) {
    if (this.ready) {
      this.instance.update(this, context);
    }
  },
  
  render: function (context) {
    if (this.ready && this.visible) {
      this.instance.render(this, context);
    }
  },
  
  renderEmitters: function (context) {
    if (this.ready && this.visible) {
      this.instance.renderEmitters(this, context);
    }
  },
  
  renderColor: function () {
    if (this.ready && this.visible) {
      this.instance.renderColor(this);
    }
  },
  
  getSource: function () {
    return this.asyncModel.source;
  },
  
  // Sets the parent value of a requesting Spatial.
  setRequestedAttachment: function (requester, attachment) {
    requester.setParentNode(this.instance.getAttachment(attachment));
  },
  
  requestAttachment: function (requester, attachment) {
    if (this.ready) {
      return this.setRequestedAttachment(requester, attachment);
    } else {
      this.addAsyncAction("setRequestedAttachment", arguments);
    }
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
  
  getAttachment: function (id) {
    if (this.ready) {
      return this.instance.getAttachment(id);
    }
  },
  
  getCamera: function (id) {
    if (this.ready) {
      return this.asyncModel.getCamera(id);
    }
  },
  
  setSequence: function (id) {
    this.sequence = id;
    
    if (this.ready) {
      this.instance.setSequence(id);
    } else {
      this.addAsyncAction("setSequence", arguments);
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
      this.addAsyncAction("setSequenceLoopMode", arguments);
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
      return this.asyncModel.getSequences();
    }
    
    return [];
  },
  
  getAttachments: function () {
    if (this.ready) {
      return this.asyncModel.getAttachments();
    }
    
    return [];
  },
  
  getCameras: function () {
    if (this.ready) {
      return this.asyncModel.getCameras();
    }
    
    return [];
  },
  
  getMeshCount: function () {
    if (this.ready) {
      return this.asyncModel.getMeshCount();
    }
  },
  
  getMeshVisibilities: function () {
    if (this.ready) {
      return this.instance.getMeshVisibilities();
    }
    
    return [];
  },
  
  setMeshVisibility: function (meshId, visible) {
    if (this.ready) {
      this.instance.setMeshVisibility(meshId, visible);
    }
  },
  
  getMeshVisibility: function (meshId) {
    if (this.ready) {
      return this.instance.getMeshVisibility(meshId);
    }
  },
  
  setVisibility: function (b) {
    this.visible = b;
  },
  
  getVisibility: function () {
    return this.visible;
  },
  
  getInfo: function () {
    return {
      modelInfo: this.asyncModel.getInfo(),
      visible: this.visible,
      sequence: this.getSequence(),
      sequenceLoopMode: this.getSequenceLoopMode(),
      location: this.getLocation(),
      rotation: this.getRotation(),
      scale: this.getScale(),
      parent: this.getParent(),
      teamColor: this.getTeamColor(),
      textureMap: this.getTextureMap(),
      meshVisibilities: this.getMeshVisibilities()
    };
  },
  
  toJSON: function () {
    var location = this.location;
    var rotation = this.rotation;
    var scale = this.scaling[0];
    
    // This code avoids saving instance overrides that match the model's texture map.
    // For example, when the client overrides a texture and then sets it back to the original value.
    var textureMap = {};
    var modelTextureMap = this.asyncModel.getTextureMap();
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
      this.asyncModel.id,
      this.sequence,
      this.sequenceLoopMode,
      // For some reason, when typed arrays are JSON stringified they change to object notation rather than array notation
      [location[0], location[1], location[2]],
      [rotation[0], rotation[1], rotation[2], rotation[3]],
      scale,
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

// Mixins
Async.call(AsyncModelInstance.prototype);
Spatial.call(AsyncModelInstance.prototype);