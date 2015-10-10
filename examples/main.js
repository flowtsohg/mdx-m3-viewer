var canvas = document.getElementById("canvas");
var viewer;

canvas.width = 800;
canvas.height = 600;

// A simple event logger
function logEvent(e) {
    console.log(e);
}

// A path solver is used for every load call.
// The purpose of a path solver is to transform local paths to actual paths on the server.
// For example, if your resources are in the directory "Resources", and you want to load the model "cube.obj", then the path solver should return "Resources/"+path.
// You can use different solvers for different loads, to fit whatever mapping you want.
function pathSolver(path) {
    return path;
}

try {
    viewer = ModelViewer(canvas);
    
    // Log events
    viewer.addEventListener("loadstart", logEvent);
    viewer.addEventListener("load", logEvent);
    viewer.addEventListener("loadend", logEvent);
    viewer.addEventListener("progress", logEvent);
    viewer.addEventListener("error", logEvent);
    viewer.addEventListener("remove", logEvent);
    viewer.addEventListener("abort", logEvent);

    // The boolean at the end determines if the handler is going to receive a string (true) or an ArrayBuffer (false).
    viewer.registerModelHandler(".obj", OBJModel, OBJModelInstance, true);

    // Since BMP is a binary format, the last argument can ignored and will therefore evaluate to false.
    viewer.registerTextureHandler(".bmp", BMPTexture);
    
    var myModelInstance = viewer.load("cube.obj", pathSolver); // returns AsyncModelInstance
    var myTexture = viewer.load("test.bmp", pathSolver); // returns AsyncTexture

    // Note that you can do this as well, if the path solver is shared:
    var myObjects = viewer.load(["cube.obj", "test.bmp"], pathSolver); // returns [AsyncModelInstance, AsyncTexture]
} catch (e) {
    // Fatal error, the viewer can't run on this computer/browser (bad browser, bad GPU drivers, bad GPU, etc.)
    console.log(e);
}