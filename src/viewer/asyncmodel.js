function AsyncModel(source, id, textureMap) {
  this.ready = false;
  this.fileType = getFileExtension(source).toLowerCase();
  this.handler = AsyncModel.handlers[this.fileType];
  
  if (this.handler) {
    this.isModel = true;
    this.id = id;
    this.source = source;
    
    // Use the Async mixin
    this.setupAsync();
      
    getFile(source, true, this.setup.bind(this, textureMap || {}), onerrorwrapper.bind(this), onprogresswrapper.bind(this));
    
    onloadstart(this);
  } else {
    console.log("AsyncModel: No handler for file type " + this.fileType);
  }
}

AsyncModel.handlers = {
  "mdx": Mdx.Model,
  "m3": M3.Model
};


AsyncModel.prototype = {
  setup: function (textureMap, e) {
    var status = e.target.status;
    
    if (status === 200) {
      var binaryReader = new BinaryReader(e.target.response),
            handler = this.handler,
            model = new handler(binaryReader, textureMap);
      
      if (model.ready) {
        this.model = model;
        this.ready = true;
      
        this.runAsyncActions();
        
        onload(this);
      }
    } else {
      onerror(this, "" + status);
    }
  },
 
  setupInstance: function (instance, textureMap) {
    if (this.ready) {
      instance.setup(this.model, this.fileType, textureMap);
    } else {
      this.addAsyncAction("setupInstance", arguments);
    }
  },
  
  // Return the name of the model itself
  getName: function () {
    if (this.ready) {
      return this.model.name;
    }
  },
  
  // Return the source of this model
  getSource: function () {
    return this.source;
  },
  
  getAttachment: function (id) {
    if (this.ready) {
      return this.model.getAttachment(id);
    }
  },
  
  getCamera: function (id) {
    if (this.ready) {
      return this.model.getCamera(id);
    }
  },
  
  overrideTexture: function (path, override) {
    if (this.ready) {
      this.model.overrideTexture(path, override);
    } else {
      this.addAsyncAction("overrideTexture", arguments);
    }
  },
  
  getTextureMap: function () {
    if (this.ready) {
      return this.model.getTextureMap();
    }
  },
  
  getSequences: function () {
    if (this.ready) {
      return this.model.getSequences();
    }
  },
  
  getCameras: function () {
    if (this.ready) {
      return this.model.getCameras();
    }
  },
  
  getBoundingShapes: function () {
    if (this.ready) {
      return this.model.getBoundingShapes();
    }
  },
  
  getAttachments: function () {
    if (this.ready) {
      return this.model.getAttachments();
    }
  },
  
  getMeshCount: function () {
    if (this.ready) {
      return this.model.getMeshCount();
    }
  },
  
  getInfo: function () {
    if (this.ready) {
      var model = this.model;
      
      return {
        name: model.getName(),
        source: this.source,
        attachments: model.getAttachments(),
        cameras: model.getCameras(),
        textureMap: model.getTextureMap(),
        boundingShapes: model.getBoundingShapes(),
        meshCount: model.getMeshCount()
      };
    }
  },
  
  toJSON: function () {
    var modelTextureMap = this.getTextureMap();
    var textureMap = {};
    var key, keys = Object.keys(modelTextureMap);
      
    for (var i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      if (urls.mpqFile(key) !== modelTextureMap[key]) {
        textureMap[key] = modelTextureMap[key];
      }
    }
    
    return [
      this.id,
      this.source,
      textureMap
    ];
  },
  
  fromJSON: function (object) {
    
  }
};

// Mixins
Async.call(AsyncModel.prototype);