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

    // Note that you can do this as well, if the path solver is shared.
    // Also note that since these resources were already loaded above, this call won't result in actual server fetches, but instead create an instance
    // with the actual model loaded above as its model, and return a reference to the texture loaded above.
    var myObjects = viewer.load(["cube.obj", "test.bmp"], pathSolver); // returns [AsyncModelInstance, AsyncTexture]

    // Here's an example of loading in-memory objects, such as valid JS image source (Image, Canvas, Video, ImageData), or just arbitrary data that an handler knows how to parse.
    var myModelData = "put real data here"; // Any kind of source that an handler can use, e.g. a string in the case of BMP, or an ArrayBuffer for binary models, or anything else that your handler can handle.
    var myImage = new Image(); // Put something meaningfull

    // The path solver might or might not be needed - this depends on your handler. For example, if it handles a model format with textures that will be fetched from the server, they will need a path solver.
    // Note that to denote that a source is in-memory, you have to override its file type in the third and optional parameter of load.
    // Also note that you never need to override the file type of JS image sources, they are special cases.
    var myOtherObjects = viewer.load([myModelData, myImage], null, [".obj"])

    // If you want to load both in-memory and server resources at the same time, the override for the server resources should be null, for example:
    var myOtherOtherObjects = viewer.load(["fake/resource.bmp", myModelData], pathSolver, [null, ".obj"]);
} catch (e) {
    // Fatal error, the viewer can't run on this computer/browser (bad browser, bad GPU drivers, bad GPU, etc.)
    console.log(e);
}