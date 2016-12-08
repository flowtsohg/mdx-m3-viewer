let canvas = document.getElementById("canvas");

canvas.width = 800;
canvas.height = 600;

// Create the viewer!
let viewer = new ModelViewer(canvas);

// Scenes are generally not something you'll need, they are used to have different cameras for different instances.
// In any case, all instances go by default to the first scene, and therefore the first scene's camera is the default camera.
// The camera is based on Node, so all Node functions work on it.
let camera = viewer.scenes[0].camera;
camera.move([0, 0, -1000]);

// The model viewer, and every resource it loads, all support the following events.
// They are all event emitters, and use the standard JS model of event emitters (addEventListener, removeEventListener, dispatchEvent).
// In addition to these events, the model viewer itself has the "render" event, which is called every frame right after rendering.
// Since all resources are event emitters, it is very easy for the implementation to add its own events.
// For an example of this, the Mdx and M3 model instances send the "seqend" event, every time an animation sequence finishes.
viewer.addEventListener("loadstart", (e) => console.log(e));
viewer.addEventListener("load", (e) => console.log(e));
viewer.addEventListener("loadend", (e) => console.log(e));
viewer.addEventListener("progress", (e) => console.log(e));
viewer.addEventListener("error", (e) => console.log(e));
viewer.addEventListener("delete", (e) => console.log(e));

// A handler is an object that describes the neccassary properties to handle some resource.
// For example, the Bmp handler is a texture handler, and thus has a Texture getter, that returns the texture implementation BmpTexture.
// Every handler has a list of extensions that are linked to it, much like how extensions work on the operating system.
// When a resource is being loaded, the extension used will determine the handler.
// In this case, Bmp.extension is a getter that returns ".bmp".
// If one handler handles multiple extensions, they can be added with pipe characters inbetween, like the Png handler's extension - ".png|.jpg|.gif".
// Finally, the Bmp handler defines the binaryFormat getter to true, which means that any HTTP requests made for it will return an ArrayBuffer, instead of a string.
viewer.addHandler(Bmp);

// Same deal as the above, but Obj is a model handler.
// Model handlers are slightly more complicated.
// The same idea of getters apply also here, but there are 4 implementation getters instead of 1.
// 1) Model - The model implementation (e.g. ObjModel).
// 2) ModelView (optional) - The model's view implementation (e.g. ModelView).
// 3) ModelInstance (optional) - The model instance implementation (e.g. ObjModelInstance).
// 4) Bucket (optional) - The model's bucket implementation (e.g. Bucket).
// Note that ModelView, ModelInstance, and Bucket, default to the base implementation - you are not required to define your own implementations if you don't need to.
viewer.addHandler(Obj);

// A path solver is used for every load call.
// The purpose of a path solver is to transform local paths to either of 1) A server fetch, or 2) A local load.
// A path solver must return the resource source, file extension, and whether it's a server fetch.
// The above are served as an array of [src, extension, serverFetch]
// This pathsolver returns the path prepended by "resources/", to make the paths you supply to load calls shorter.
// It returns the extension of the path directly (assuming it's an actual file path!).
// Lastly, it says that this path is a server fetch.
// If the solver returns anything false-like for the third element, there will be no server fetch, and src will be directly sent to the implementation.
// This can be used if you want in-memory loads (e.g. see the W3x handler's path solver, which handles both server fetches and local loads for Warcraft 3 maps).
function pathSolver(path) {
    return ["resources/" + path, path.substr(path.lastIndexOf(".")), true];
}

// Load our BMP image!
// Note that because of the path solver used, the final path is correctly "resources/texture.bmp".
// This returns the BMP handler's BmpTexture.
// Note that while everything supposedly works instantly, the texture didn't actually finish loading yet, but the rest of the code is still free to reference this object.
let texture = viewer.load("texture.bmp", pathSolver);

// Every viewer resource has a whenLoaded function, and the viewer itself has whenAllLoaded.
// These functions are much like attaching an event listener to the "loadend" event, but it also calls the given callback if the resource was already loaded.
// ModelViewer.whenAllLoaded works the same way, but takes an array of resources instead, for cases where you want to wait for multiple resources to load before doing something.
// In this case, let's print that the texture was loaded, whenever it's actually loaded, and the time that passed.
let initTime = new Date();
texture.whenLoaded(() => console.log("texture.bmp loaded, it took " + (new Date() - initTime) + " miliseconds!"));

// Load our OBJ model!
// Note that because of the path solver used, the final path is correctly "resources/cube.obj".
let model = viewer.load("cube.obj", pathSolver);

// Let's see that whenAllLoaded in action!
viewer.whenAllLoaded([texture, model], (e) => console.log("The texture and model finished loading!"));

// Create an instance of this model.
let instance = model.addInstance();

// Move the instance and scale it uniformly.
instance.move([50, 0, 0]).uniformScale(2);

// Let's create another instance, and mess with it.
let instance2 = model.addInstance().move([-150, 0, 0]).scale([0.5, 2, 5]);

// Finally, let's mess around with nodes.
instance2.setParent(instance);

// quat and vec3 are a part of glMatrix, which is used by the viewer, see http://glmatrix.net/ 
let q = quat.setAxisAngle([], vec3.normalize([], [1, 1, 1]), Math.PI / 120);
let q2 = quat.setAxisAngle([], vec3.normalize([], [1, 1, 1]), Math.PI / 30);

// e.target == viewer, for the "render" event.
viewer.addEventListener("render", (e) => {
    instance.rotate(q);
    instance2.rotate(q2);
});
