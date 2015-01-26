function onloadend(e) {
  console.log(e);
}

var urls = {
    header: function (id) {
        return "http://www.mysite.com/?getresource=" + id;
    },

    mpqFile: function (path) {
        return path;
    },

    localFile: function (path) {
        return "images/" + path;
    }
};

var canvas = document.getElementById("canvas");
var viewer;

try {
    viewer = ModelViewer(canvas, urls);
    
    viewer.registerModelHandler(".obj", OBJModel, OBJModelInstance);
    viewer.registerTextureHandler(".bmp", BMPTexture);
    
    viewer.addEventHandler("loadend", onloadend);
    
    viewer.load("cube.obj");
    viewer.load("test.bmp");
} catch (e) {
    // Fatal error, the viewer can't run on this computer/browser.
    console.log(e);
}