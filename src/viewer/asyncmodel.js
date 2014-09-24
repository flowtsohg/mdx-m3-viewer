function AsyncModel(source, id, textureMap) {
  this.ready = false;
  this.fileType = getFileExtension(source).toLowerCase();
  this.handler = AsyncModel.handlers[this.fileType];
  
  if (this.handler) {
    this.isModel = true;
    this.id = id;
    this.source = source;
    
    // This texture map is used to override textures when a model is loaded from an ID
    this.textureMap = textureMap || {};
    
    // Use the Async mixin
    this.useAsync();
      
    getFile(source, true, this.setup.bind(this), onerrorwrapper.bind(this), onprogresswrapper.bind(this));
    
    onloadstart(this);
  } else {
    console.log("AsyncModel: No handler for file type " + this.fileType);
  }
  
  console.log(this);
}

AsyncModel.handlers = {
  "mdx": [Mdx.Parser, Mdx.Model],
  "m3": [M3.Parser, M3.Model]
};


AsyncModel.prototype = {
  setup: function (e) {
    var status = e.target.status;
    
    if (status === 200) {
      var handler = this.handler,
            reader = new BinaryReader(e.target.response),
            parser = new handler[0](reader);
      
      if (parser) {
        if (DEBUG_MODE) {
          console.log(parser);
        }
        
        this.model = new handler[1](parser, this.textureMap);
        
         if (DEBUG_MODE) {
          console.log(this.model);
        }
        
        this.ready = true;
      }
      
      if (this.ready) {
        this.runAsyncActions();
        
        onload(this);
      }
    } else {
      onerror(this, "" + status);
    }
  },
 
  setupInstance: function (instance) {
    if (this.ready) {
      instance.setup(this.model, this.fileType);
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
      if (this.model.attachments) {
        return this.model.attachments[id];
      }
    }
  },
  
  getCamera: function (id) {
    if (this.ready) {
      if (this.model.cameras) {
        return this.model.cameras[id];
      }
    }
  },
  
  getTransform: function () {
    if (this.ready) {
      this.model.getTransform();
    }
  },
  
  overrideTexture: function (path, newpath) {
    if (this.ready) {
      this.textureMap[path] = newpath;
    } else {
      this.addAsyncAction("overrideTexture", arguments);
    }
  },
  
  getTextureMap: function () {
    if (this.ready) {
      return Object.copy(this.model.textureMap);
    }
  },
  
  getSequences: function () {
    if (this.ready) {
      return getNamesFromObjects(this.model.sequences);
    }
  },
  
  getAttachments: function () {
    if (this.ready) {
      return getNamesFromObjects(this.model.attachments);
    }
  },
  
  getCameras: function () {
    if (this.ready) {
      return getNamesFromObjects(this.model.cameras);
    }
  },
  
  getMeshCount: function () {
    if (this.ready) {
      return this.model.meshes.length;
    }
  },
  
  getInfo: function () {
    return {
      name: this.getName(),
      source: this.getSource(),
      sequences: this.getSequences(),
      attachments: this.getAttachments(),
      cameras: this.getCameras(),
      textureMap: this.getTextureMap()
    };
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