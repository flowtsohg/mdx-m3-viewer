**NO LONGER ACTIVELY MAINTAINED.**

mdx-m3-viewer
=============

At the core of it, a 3D model viewer for MDX and M3 models used by the games Warcraft 3 and Starcraft 2 respectively.

The viewer part handles the following formats:
* MDX (Warcraft 3 model): extensive support, almost everything should work.
* M3 (Starcraft 2 model): partial support.
* W3M/W3X (Warcraft 3 map): partial support.
* BLP1 (Warcraft 3 texture): extensive support, almost everything should work.
* TGA (image): partial support, only simple 24bit images.
* DDS (compressed texture): partial support - DXT1/DXT3/DXT5/RGTC.
* PNG/JPG/GIF: supported as a wrapper around Image.
* GEO (a simple JS format used for geometric shapes): note that this is solely a run-time handler.

There are file parsers that the viewer depends on.\
These don't rely on the viewer or indeed on even running in a browser.\
They include:
* MDX/MDL: read/write.
* M3: read.
* BLP1: read.
* INI: read.
* SLK: read.
* MPQ1: read/write.
* W3M/W3X/W3N: read/write, including all of the internal files.
* DDS: read (DXT1/DXT3/DXT5/RGTC).

There are all sorts of utilities that were made over the years.\
These include things like...
* The library's unit tester, which compares rendered results against stored images that were generated in the same way.
* The MDX sanity test, which looks for errors and weird things in MDX models.
* A Jass context that can...well, run Jass code. That being said, it really runs Lua code converted from Jass, on a JS Lua VM. What a tongue twiser. While it supports some Warcraft 3 natives, don't expect it run whole maps. Maybe in the future 😉
* A utility that makes it possible to open Warcraft 3 maps in the vanilla World Editor, in cases were said maps used a non-vanilla editor with extended GUI, in which case they crash upon opening in the official editor.
* etc.

Finally, the library also comes with a bunch of clients.\
A "client" in this context means external code that uses the library.\
Most of these clients are simple and messy, since they were made as side projects while working on the library.\
Most of these clients are also just wrappers around the viewer and the utilities, merely giving them an interface on a web page.\
These include things like...
* A simple example client.
* The unit tester's page, which allows to run the unit tests, and to download the results.
* The MDX sanity test's page, which visually shows the results of sanity tests, and other nifty things.
* etc.

------------------------

#### Building

```
npm install mdx-m3-viewer
npm run build
```
This will generate `dist/viewer.min.js`.

If you are using Typescript, you can also import anything in the library directly.\
For example, if you only care about an MDX viewer, you could do the following:
```javascript
import ModelViewer from 'mdx-m3-viewer/src/viewer/viewer';
import mdxHandler from 'mdx-m3-viewer/src/viewer/handlers/mdx/handler';
```
This way, you don't import any parsers/handlers/utilities that are not needed.

------------------------

#### Getting started

1. Run the given demo HTTP server `npm run serve`.
2. In your browser, open `http://localhost/clients/example`.
3. You can also check the other more advanced clients.

------------------------

#### Usage

You can import the viewer in different ways:
```javascript
// webpack export in the browser.
new ModelViewer.default.viewer.ModelViewer(canvas);

// require/import the library.
const ModelViewer = require('mdx-m3-viewer'); // CommonJS.
import ModelViewer from 'mdx-m3-viewer'; // ES6.
new ModelViewer.viewer.ModelViewer(canvas);

// require/import something directly.
const ModelViewer = require('mdx-m3-viewer/src/viewer/viewer'); // CommonJS.
import ModelViewer from 'mdx-m3-viewer/src/viewer/viewer'; // ES6.
new ModelViewer(canvas);

```

All code snippets will use the names as if you imported them directly to avoid some mess. See the examples for actual namespacing.

First, let's create the viewer:
```javascript
let canvas = ...; // A <canvas> aka HTMLCanvasElement object.

let viewer = new ModelViewer(canvas);
```

If the client doesn't have the WebGL requierments to run the viewer, an exception will be thrown when trying to create it.

When a new viewer instance is created, it doesn't yet support loading anything, since it has no handlers.\
Handlers are simple JS objects with a specific signature, that give information to the viewer (such as a file format(s), and the implementation objects).\
When you want to load something, the viewer will select the appropriate handler, if there is one, and use it to construct the object.

Let's add the MDX handler.\
This handler handles MDX files, unsurprisingly. It also adds the BLP and TGA handlers automatically, since it requires them.

```javascript
viewer.addHandler(handlers.mdx);
```

Next, let's add a new scene to the viewer. Each scene has its own camera and viewport, and holds a list of things to render.
```javascript
let scene = viewer.addScene();
```

Finally, let's move the scene's camera backwards a bit.
```javascript
scene.camera.move([0, 0, 500]);
```

The viewer class acts as a sort-of resource manager.\
Loading models and textures happens by using handlers and `load`, while other files are loaded generically with `loadGeneric`.

For handlers, the viewer uses path solving functions.\
You supply a function that takes a source you want to load, such as an url, and you need to return specific results so the viewer knows what to do.\
The load function itself looks like this:

```javascript
let resource = viewer.load(src, pathSolver[, solverParams])
```

In other words, you give it a source, and a resource is returned, where a resource in this context means a model or a texture.

The source can be anything - a string, an object, a typed array, something else - it highly depends on your code, and on the path solver.

The path solver is a function with this signature: `function(src[, solverParams]) => [finalSrc, extension, isFetch]`, where:
* `src` is the source you gave the load call, or one given by the resource itself when loading internal resources.
* `finalSrc` is the actual source to load from. If this is a server fetch, then this is the url to fetch from. If it's an in-memory load, it depends on what each handler expects, typically an ArrayBuffer or a string.
* `extention` is the extension of the resource you are loading, which selects the handler to use. For example, both `".mdx"` and `"mdx"` are valid.
* `isFetch` is a boolean, and will determine if this is an in-memory load, or a server fetch.

Generally speaking, you'll need a simple path solver that expects urls, prepends them by some base directory or API url, uses their extension, and signals that they are fetches.\
There are however times when this is not the case, such as loading models with custom textures, and handling both in-memory and fetches in the same solver as done in the map viewer.

For information about `solverParams`, see the [solver parameters section](#solver-params-reforged-and-map-loading).

So let's use an example.

Suppose we have the following directory structure:

```
├── index.html
└── Resources
	  ├── model.mdx
	  └── texture.blp
```

Where `model.mdx` uses the texture `texture.blp`.

Let's see how a possible path solver could look.\
I'll make it assume it's getting urls, and automatically prepend "Resources/" to sources.

```javascript
function myPathSolver(path) {
  // Prepend Resources/, and get the extension from the path.
  return ["Resources/" + path, path.slice(path.lastIndexOf('.')), true];
}
```

Now let's try to load the model.

```javascript
let model = viewer.load("model.mdx", myPathSolver);
```

This function call results in the following:

1. myPathSolver is called with `"model.mdx"` and returns `["Resources/model.mdx", ".mdx", true]`.
2. The viewer chooses the correct handler based on the extension - in this case the MDX handler - sees this is a server fetch, and uses the final source for the fetch.
3. A new MDX model is created and starts loading (at this point the viewer gets a `loadstart` event from the model).
4. The model is returned.
5. ...time passes until the model finishes loading...
6. The model is constructed successfuly, or not, and sends a `load` or `error` event respectively, followed by the `loadend` event.
7. In the case of an MDX model, the previous step will also cause it to load its textures, in this case `texture.blp`.
8. myPathSolver is called with `"texture.blp"`, which returns `["Resources/texture.blp", ".blp", true]`, and we loop back to step 2, but with a texture this time.

We now have a model, however a model in this context is simply a source of data, not something that you see.\
The next step is to create an instance of this model.\
Instances can be rendered, moved, rotated, scaled, parented to other instances or nodes, play animations, and so on.
```javascript
let instance = model.addInstance();
```

Let's add the instance to the scene, so it's rendered:
```javascript
scene.addInstance(instance);
// Equivalent to:
instance.setScene(scene);
```

Finally, we need to actually let the viewer update and render:
```javascript
(function step() {
  requestAnimationFrame(step);

  viewer.updateAndRender();
}());
```

---

Loading other files is simpler:
```javascript
let genericResource = viewer.loadGeneric(path, dataType[, callback]);
```

Where:
* `path` is an url string.
* `dataType` is a string with one of these values: `text`, `arrayBuffer`, `blob`, or `image`.
* `callback` is a function that will be called with the data once the fetch is complete, and should return the resource's data.

If a callback is given, `resource.data` will be whatever the callback returns.\
If a promise is returned, the loader waits for it to resolve, and uses whatever it resolved to.\
If no callback is given, the data will be the fetch data itself, according to the given data type.

`loadGeneric` is a simple layer above the standard `fetch` function.\
The purpose of loading other files through the viewer is to cache the results and avoid multiple loads, while also allowing the viewer itself to handle events correctly, such as `whenAllLoaded`.

------------------------

#### Async everywhere I go

The viewer tries to allow you to write linear code, even though many things are asyncronious.

Sometimes this is not possible, for example when you want to get the list of animations a model has. If the model wasn't loaded yet, the list will be empty.

There are two ways to react to resources being loaded: promises/callbacks, and events.

In addition, every resource has two loading hints: `loaded`, and `ok`.\
When a resource is `loaded`, it means that it doesn't need further processing by the viewer. It doesn't however neccessarily mean the resource loaded successfully.\
When a resource is `ok`, it means it actually loaded successfully and is ready for use.

##### Promises/Callbacks

Every resource has a `whenLoaded([callback])` method that waits for it to load.
If a callback is given, it will be used. Otherwise, a promise is returned.
If the resource was already loaded, the callback/promise is immediately called/resolved.

The viewer itself has `whenLoaded(resources[, callback])` which does the same when all of the given resources in an iterable have been loaded, and also `whenAllLoaded([callback])`, to check when there are no longer resources being loaded.

Some examples of callbacks/promises:

```javascript
model.whenLoaded()
  .then((model) => {
    // Must be true!
    console.assert(model.loaded);

    // May be true.
    console.log(model.ok);

    // Assuming this is an MDX/M3 model, let's print all of its animation names.
    // If model.ok is false, this will print an empty line, since sequences is an empty array.
    console.log(model.sequences.map((sequence) => sequence.name));
  });

viewer.whenLoaded([model, otherModel])
  .then(([model, otherModel]) => {
    // Do something.
  });

viewer.whenAllLoaded((viewer) => {
  // Everything loaded
})
```

##### Events

Events are done with the NodeJS EventEmitter API:

```javascript
resource.on(eventName, listener)
resource.off(eventName, listener)
resource.once(eventName, listener)
resource.emit(eventName[, ...args])
```

If a listener is attached to a specific resource, such as a model, it only gets events from that resource.\
If a listener is attached to the viewer itself, it will receive events for all resources.

The event name can be one of:
* `loadstart` - a resource started loading.
* `load` - a resource successfully loaded.
* `error` - something bad happened.
* `loadend` - a resource finished loading, follows both `load` and `error` when loading a resource.

Note that attaching a `loadstart` listener to a resource is pointless, since the listener is registered after the resource started loading - attach it to the viewer instead.

Some examples of event listeners:

```javascript
model.on('load', (model) => {
  // Must be true!
  console.assert(model.loaded);

  // Must be true!
  console.assert(model.ok);
  
  // Assuming this is an MDX/M3 model, let's print all of its animation names.
  console.log(model.sequences.map((sequence) => sequence.name));
});

model.on('loadend', (model) => {
  // Must be true!
  console.assert(model.loaded);

  // May be true.
  console.log(model.ok);

  // Assuming this is an MDX/M3 model, let's print all of its animation names.
  // If model.ok is false, this will print an empty line, since sequences is an empty array.
  console.log(model.sequences.map((sequence) => sequence.name));
});

// target is the resource for which the error occured.
// For global errors, this will be the viewer itself.
viewer.on('error', (target, error, reason) => {
  console.log(`Error: ${error}, Reason: ${reason}`, target);
});
```

------------------------

#### Solver Params, Reforged, and map loading

As mentioned above, when loading resources, the `solverParams` parameter can be supplied.
Solver parameters allow to give additional information about a load to the path solver.
A client can supply its own solver parameters, and the handler implementations can supply their own parameters for internal resources.

This is used by the MDX handler to request SD/HD resources from Reforged.

It's also used by the map viewer to request SD/HD resources from Reforged, and to select the tileset.

For example, let's suppose we want to load the Warcraft 3 Footman model, but with a twist - we want all three versions of it - TFT, Reforged SD, and Reforged HD.

The MDX handler defines the parameters as such: `{reforged?: boolean, hd?: boolean}`.

If `reforged` is falsy or doesn't exist, then it wants a TFT resource.\
If `reforged` is true, then it wants a Reforged SD resource and...\
If `hd` and `reforged` are true, then it wants a Reforged HD resource.

Following this, the loading code can be something along these lines:
```js
let modelTFT = viewer.load('Units/Human/Footman/Footman.mdx', mySolver);
let modelReforged = viewer.load('Units/Human/Footman/Footman.mdx', mySolver, {reforged: true});
let modelHD = viewer.load('Units/Human/Footman/Footman.mdx', mySolver, {reforged: true, hd: true});
```

Note that you don't have to use these exact values.
Rather, these are the values that will be sent by the MDX handler or map viewer, when loading internal textures, models, and generic files.

What does the path solver do, then?
As always, that depends on the client and the server.
For example, the client may append the parameters as url parameters, which can be seen in the existing clients.
The client can also completely ignore these parameters and return whatever resources it wants.
