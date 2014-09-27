function onmessage(e) {
  console.log(e);
}

var urls = {
  header: function (id) {
    return "http://www.mysite.com/?getresource=" + id;
  },
  
  mpqFile: function (path) {
    return "http://www.mysite.com/?mpqfile=" + path;
  },
  
  localFile: function (path) {
    return "images/" + path;
  }
};

var canvas = document.getElementById("canvas");
var viewer = ModelViewer(canvas, urls, onmessage);

if (viewer) {
  // Register the OBJ handler
  // The last optional parameter defines if this format is a text format or binary format.
  // If it is set to true, the model handler will get an ArrayBuffer object instead of a string.
  viewer.registerModelHandler("obj", OBJModel, OBJModelInstance, false);
  
  // Register the BMP handler
  viewer.registerTextureHandler("bmp", BMPTexture);
  
  // Do stuff...
}