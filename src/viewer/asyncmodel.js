function AsyncModel(source, id, textureMap) {
  this.ready = false;
  this.fileType = getFileExtension(source).toLowerCase();
  this.isModel = true;
  this.id = id;
  this.source = source;
  
  // All the instances owned by this model
  this.instances = [];
  
  // Use the Async mixin
  this.setupAsync();
    
  getFile(source, true, this.setup.bind(this, textureMap || {}), onerrorwrapper.bind(this), onprogresswrapper.bind(this));
  
  onloadstart(this);
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
            model = new AsyncModel.handlers[this.fileType](binaryReader, textureMap, context);
      
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
      this.instances.push(instance);
      
      instance.setup(this.model, textureMap);
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
  
  getInstances: function () {
    if (this.ready) {
      var i,
            l,
            instances = this.instances,
            instance,
            ids = [];
      
      for (i = 0, l = instances.length; i < l; i++) {
        instance = instances[i];
        
        if (instance.ready) {
          ids.push(instance.id);
        }
      }
      
      return ids;
    }
  },
  
  getInfo: function () {
    if (this.ready) {
      var model = this.model;
      
      return {
        name: model.getName(),
        source: this.source,
        attachments: model.getAttachments(),
        sequences: model.getSequences(),
        cameras: model.getCameras(),
        textureMap: model.getTextureMap(),
        boundingShapes: model.getBoundingShapes(),
        meshCount: model.getMeshCount(),
        instances: this.getInstances()
      };
    }
  },
  
  toJSON: function () {
    var textureMap = {},
          localTextureMap = this.getTextureMap(),
          keys = Object.keys(localTextureMap),
          key,
          i,
          l;
    
    // This code avoids saving redundant texture paths.
    // Only textures that have been overriden are saved.
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      if (urls.mpqFile(key) !== localTextureMap[key]) {
        textureMap[key] = localTextureMap[key];
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

mixin(Async, AsyncModel);