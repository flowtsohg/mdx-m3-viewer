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
  viewer.registerModelHandler("obj", OBJModel, OBJModelInstance);
  
  // Do stuff...
}