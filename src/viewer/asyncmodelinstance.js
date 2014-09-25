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
    
    // Used for color picking
    this.color = color;
    
    // Use the Async mixin
    this.setupAsync();
    
    // Use the Spatial mixin
    this.setupSpatial();
    
    // If the model is already ready, the onload message from setup() must be delayed, since this instance wouldn't be added to the cache yet.
    if (asyncModel.ready) {
      this.delayOnload = true;
    }
    
    // Request the setup function to be called by the model when it can.
    // If the model is loaded, setup runs instantly, otherwise it runs when the model finishes loading.
    asyncModel.setupInstance(this, textureMap || {});
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
  setup: function (model, fileType, textureMap) {
    this.fileType = fileType;
    this.handler = AsyncModelInstance.handlers[fileType];
    
    this.instance = new this.handler(model, textureMap);
    
    if (this.fileType === "m3") {
      // Transform to match the direction and size of MDX models
      this.rotate([0, 0, -Math.PI / 2]);
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
  
  renderBoundingShapes: function (context) {
    if (this.ready && this.visible) {
      this.instance.renderBoundingShapes(context);
    }
  },
  
  renderColor: function () {
    if (this.ready && this.visible) {
      this.instance.renderColor(this);
    }
  },
  
  getName: function () {
    if (this.ready) {
      return this.instance.getName() + "[" + this.id + "]";
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
    if (this.ready) {
      this.instance.overrideTexture(source, path);
    }
  },
  
  getTextureMap: function () {
    if (this.ready) {
      return this.instance.getTextureMap();
    }
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
    if (this.ready) {
      this.instance.setTeamColor(id);
    }
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
      rotationQuat: this.getRotationQuat(),
      scale: this.getScale(),
      parent: this.getParent(),
      teamColor: this.getTeamColor(),
      textureMap: this.getTextureMap(),
      meshVisibilities: this.getMeshVisibilities(),
      name: this.getName()
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