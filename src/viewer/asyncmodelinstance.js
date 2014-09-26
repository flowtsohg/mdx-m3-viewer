function AsyncModelInstance(asyncModel, id, color, textureMap) {
  this.ready = false;
  this.fileType = asyncModel.fileType;
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
}

AsyncModelInstance.handlers = {
  "mdx": Mdx.ModelInstance,
  "m3": M3.ModelInstance
};

AsyncModelInstance.prototype = {
  // Setup the internal instance using the internal model implementation
  setup: function (model, textureMap) {
    this.instance = new AsyncModelInstance.handlers[this.fileType](model, textureMap);
    
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
      this.instance.renderColor(this, context);
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
      this.addAsyncAction("setRequestedAttachment", [requester, attachment]);
    }
  },
  
  overrideTexture: function (path, override) {
    if (this.ready) {
      this.instance.overrideTexture(path, override);
    } else {
      this.addAsyncAction("overrideTexture", [path, override]);
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
    if (this.ready) {
      this.instance.setSequence(id);
    } else {
      this.addAsyncAction("setSequence", [id]);
    }
  },
  
  getSequence: function () {
    if (this.ready) {
      return this.instance.getSequence();
    }
  },
  
  setSequenceLoopMode: function (mode) {
    if (this.ready) {
      this.instance.setSequenceLoopMode(mode);
    } else {
      this.addAsyncAction("setSequenceLoopMode", [mode]);
    }
  },
  
  getSequenceLoopMode: function () {
    if (this.ready) {
      return this.instance.getSequenceLoopMode();
    }
  },
  
  setTeamColor: function (id) {
    if (this.ready) {
      this.instance.setTeamColor(id);
    } else {
      this.addAsyncAction("setTeamColor", [id]);
    }
  },
  
  getTeamColor: function () {
    if (this.ready) {
      return this.instance.getTeamColor();
    }
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
  
  setMeshVisibility: function (id, mode) {
    if (this.ready) {
      this.instance.setMeshVisibility(id, mode);
    } else {
      this.addAsyncAction("setMeshVisibility", [id, mode]);
    }
  },
  
  getMeshVisibility: function (id) {
    if (this.ready) {
      return this.instance.getMeshVisibility(id);
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
      visible: this.getVisibility(),
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
    // For some reason, when typed arrays are JSON stringified they change to object notation rather than array notation.
    // This is why I don't bother to access the location and rotation directly.
    var location = this.getLocation(),
          rotation = math.toDeg(this.getRotation()),
          scale = this.getScale(),
          textureMap = {},
          localTextureMap = this.getTextureMap(),
          modelTextureMap = this.asyncModel.getTextureMap(),
          keys = Object.keys(localTextureMap),
          key,
          i,
          l,
          visibilities = this.getMeshVisibilities();
          
    // This code avoids saving instance overrides that match the model's texture map.
    // For example, when the client overrides a texture and then sets it back to the original value.
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      if (localTextureMap[key] !== modelTextureMap[key]) {
        textureMap[key] = localTextureMap[key];
      }
    }
    
    // Handle the Starcraft 2 specific differences.
    if (this.fileType === "m3") {
      rotation[2] += 90;
      scale /= 100;
    }
    
    console.log(rotation);
    
    // To avoid silly numbers like 1.0000000000000002
    location = math.floatPrecisionArray(location, 2);
    rotation = math.floatPrecisionArray(rotation, 0);
    scale = math.floatPrecision(scale, 2);
    
    console.log(rotation);
    
    // Turn booleans to numbers to shorten the string.
    for (i = 0, l = visibilities.length; i < l; i++) {
      visibilities[i] = visibilities[i] & 1;
    }
    
    return [
      this.id,
      this.asyncModel.id,
      this.getVisibility() & 1,
      this.getSequence(),
      this.getSequenceLoopMode(),
      location,
      rotation,
      scale,
      this.getParent(),
      this.getTeamColor(),
      textureMap,
      visibilities
    ];
  },
  
  fromJSON: function (object) {
    var textureMap = object[10],
          visibilities = object[11],
          keys = Object.keys(textureMap),
          key,
          i,
          l;
    
    console.log(object[6]);
          
    this.setVisibility(!!object[2]);
    this.setSequence(object[3]);
    this.setSequenceLoopMode(object[4]);
    this.setLocation(object[5]);
    this.rotate(math.toRad(object[6]));
    this.setScale(object[7]);
    this.setTeamColor(object[9]);
    
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      this.overrideTexture(key, textureMap[key]);
    }
    
    for (i = 0, l = visibilities.length; i < l; i++) {
      this.setMeshVisibility(i, visibilities[i]);
    }
  }
};

mixin(Async, AsyncModelInstance);
mixin(Spatial, AsyncModelInstance);