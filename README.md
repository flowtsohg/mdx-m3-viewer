**NO LONGER ACTIVELY MAINTAINED.**

mdx-m3-viewer
=============

A 3D model viewer for MDX and M3 models used by the games Warcraft 3 and Starcraft 2 respectively.

The `viewer` folder contains all of the 3D viewer specific functions and classes.
Built-in handlers exist for the following formats:
* MDX (Warcraft 3 model): extensive support, almost everything should work.
* M3 (Starcraft 2 model): partial support, file format not quite reverse engineered yet.
* W3M/W3X (Warcraft 3 map): partial support, will grow in future.
* BLP1 (Warcraft 3 texture): extensive support, almost everything should work.
* TGA (image): partial support, only simple 24bit images.
* DDS (compressed texture, used by Starcraft 2): partial support, should work for every Starcraft 2 texture, and probably for most DDS files in existence (DXT1/3/5).
* PNG/JPG/GIF: supported as a wrapper around Image.
* GEO (a simple JS format used for geometric shapes): note that this is solely a run-time handler.
* OBJ: partial support (more of an example handler).
* BMP: partial support (more of an example handler).

The `parsers` folder contains classes that know how to read (and some how to write) different file formats.
The parsers can be used also outside of the context of a web browser or the viewer itself.
These include:
* MDX/MDL: read/write.
* M3: read.
* BLP1: read.
* INI: read.
* SLK: read.
* MPQ1: read/write.
* W3M/W3X/W3N: read/write, including all of the internal files.

The `common` folder contains functions and classes that are relatively general, and are used by all other parts.

The `utils` folder contains mostly interesting functions and classes that are built on top of the parsers.

The `tests` folder contains a page that runs unit tests. Problem is, it uses many files owned by Blizzard, which I cannot add here.

------------------------

#### Building

1. Download and install NodeJS from https://nodejs.org/en/.
2. Open a command prompt in the viewer's directory, and run `npm install`.
3. Run `webpack-dev` to generate `dist/viewer.min.js`, with the API given under the global object ModelViewer.

You can also require/import the library or anything in it directly in a webpack project.

------------------------

#### Getting started

The examples directory has simple examples, I highly suggest looking at it first.

In case you don't have an HTTP server:
1. Open a command prompt, run `npm install http-server -g`.
2. Once it is done, at any time go to the viewer's folder, fire up the command prompt, and run `http-server -p 80`.
3. In your browser, open `http://localhost/examples/`.

------------------------

#### Usage

You can import the viewer in different ways:
```javascript
// webpack export in the browser.
ModelViewer = ModelViewer.default;
new ModelViewer.viewer.ModelViewer(canvas);

// require/import the library.
const ModelViewer = require('mdx-m3-viewer'); // CommonJS.
import ModelViewer from 'mdx-m3-viewer'; // ES6.
new ModelViewer.viewer.ModelViewer(canvas);

// require/import something directly.
const ModelViewer = require('path_to_viewer/src/viewer/viewer'); // CommonJS.
import ModelViewer from 'path_to_viewer/src/viewer/viewer'; // ES6.
new ModelViewer(canvas);

```

All code snippets will use the names as if you imported them directly to avoid some mess. See the examples for actual namespacing.

First, let's create the viewer:
```javascript
let canvas = ...; // A <canvas> aka HTMLCanvasElement object.

let viewer = new ModelViewer(canvas);
```

If the client doesn't have the WebGL requierments to run the viewer, an exception will be thrown when trying to create it.

When a new viewer instance is created, it doesn't yet support loading anything, since it has no handlers.
Handlers are simple JS objects with a specific signature, that give information to the viewer (such as a file format(s), and the implementation objects).
When you want to load something, the viewer will select the appropriate handler, if there is one, and use it to construct the object.

Let's add the MDX handler.
This handler handles MDX files, unsurprisingly. It also adds the BLP and TGA handlers automatically, since it requires them.

```javascript
viewer.addHandler(handlers.mdx);
// Or if you want to be explicit:
viewer.addHandler(handlers.mdx.handler);
```

Next, let's add a new scene to the viewer. Each scene has its own camera and viewport, and holds a list of things to render.
```javascript
let scene = viewer.addScene();
```

Finally, let's move the scene's camera backwards a bit.
```javascript
scene.camera.move([0, 0, 500]);
```


The viewer class acts as a sort-of resource manager.
Loading models and textures happens by using handlers and `load`, while other files are loaded generically with `loadGeneric`.


For handlers, the viewer uses path solving functions.
You supply a function that takes a source you want to load, such as an url, and you need to return specific results so the viewer knows what to do.
The load function itself looks like this:

```javascript
let resource = viewer.load(source, pathSolver)
```

In other words, you give it a source, and a resource is returned.
A resource in this context means a model or a texture.

The source here can be anything - a string, an object, a typed array, something else - it highly depends on your code, and on the path solver.
Generally speaking though, the source will probably be a an url string.

The path solver is a function with this signature: `function(source) => [finalSource, ext, isFetch]`, where:
* `source` is the source you gave the load call.
* `finalSource` is the actual source to load from. If this is a server fetch, then this is the url to fetch from. If it's an in-memory load, it depends on what each handler expects.
* `ext` is the extension of the resource you are loading, which selects the handler to use. The extension is given in a ".ext" format. That is, a string that contains a dot, followed by the extension. This will usually be the extension of an url.
* `isFetch` is a boolean, and will determine if this is an in-memory load, or a server fetch. This will usually be true.

So let's use an example.

Suppose we have the following directory structure:

```
index.html
Resources
	model.mdx
	texture.blp
```

Where `model.mdx` uses the texture `texture.blp`.

Let's see how a possible path solver could look.
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
8. myPathSolver is called with `texture.blp`, which returns `["Resources/texture.blp", ".blp", true]`, and we loop back to step 2, but with a texture this time.

Generally speaking, you'll need a simple path solver that returns the source assuming its an url but prepended by some directory, its extension, and true for server fetch.
There are, however, times when this is not the case, such as loading models with custom textures, handling both in-memory and server-fetches in the same solver (used by the W3X handler), etc.

We now have a model, however a model in this context is simply a source of data, not something that you see.
The next step is to create an instance of this model.
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
let resource = viewer.loadGeneric(path, dataType[, callback]);
```

Where:
* `path` is an url string.
* `dataType` is a string with one of these values: `text`, `arrayBuffer`, `blob`, or `image`.
* `callback` is a function that will be called with the data once the fetch is complete, and should return the resource's data.

It is in fact only a small layer above the standard `fetch` function.
The purpose of loading other files through the viewer is to cache the results and avoid multiple loads, while also allowing the viewer itself to handle events correctly, such as `whenAllLoaded`.

If a callback is given, `resource.data` will be whatever the callback returns.
If a promise is returned, the loader waits for it to resolve, and uses whatever it resolved to.
If no callback is given, the data will be the fetch data itself, according to the given data type.

------------------------

#### Async everywhere I go

The viewer tries to allow you to write linear code, even though many things are asyncronious.

Sometimes this is not possible, for example when you want to get the list of animations a model has. If the model wasn't loaded yet, the list will be empty.

There are two ways to react to resources being loaded: promises, and events.

##### Promises

Every resource has a `whenLoaded` method that returns a promise which is resolved when the resource loads, or immediately if it was already loaded. 

The viewer itself has `whenLoaded(resources)` which does the same when all of the given resources in an iterable have been loaded, and also `whenAllLoaded()`, whose promise is resolved when there are no longer resources being loaded.

Some examples of promises:

```javascript
model.whenLoaded()
  .then((model) => {
    // Assuming this is an MDX/M3 model, let's print all of its animation names.
    console.log(model.sequences.map((sequence) => sequence.name));
  });

viewer.whenLoaded([model, otherModel])
  .then(([model, otherModel]) => {
    // Do something.
  });

viewer.whenAllLoaded()
  .then((viewer) => {
    // Everything loaded.
  });
```

##### Events

Events are done with the NodeJS EventEmitter API:

```javascript
resource.on(eventName, listener)
resource.off(eventName, listener)
resource.once(eventName, listener)
resource.emit(eventName[, ...args])
```

If a listener is attached to a specific resource, such as a model, it only gets events from that object.
If a listener is attached to the viewer itself, it will receive events for all resources.

Note that attaching a `loadstart` listener to a resource is pointless, since the listener is registered after the resource started loading. Attach it to the viewer instead.

The event name can be one of:
* `loadstart` - a resource started loading.
* `load` - a resource successfully loaded.
* `error` - something bad happened.
* `loadend` - a resource finished loading, follows both `load` and `error` when loading a resource.

Some examples of event listeners:

```javascript
model.on('load', (model) => {
  // Assuming this is an MDX/M3 model, let's print all of its animation names.
  console.log(model.sequences.map((sequence) => sequence.name));
});

model.on('loadend', (model) => {
  // Will be true for both load and loadend.
  // loadend just means the resource doesn't need further processing to load.
  // It doesn't mean it loaded successfully.
  console.assert(model.loaded);

  // ok tells if the resource loaded successfully, and is ready to be used.
  console.log(model.ok);

  // If model.ok is true, this will print the same thing as in load.
  // If model.ok is false, this will print an empty line (sequences is an empty array!)
  console.log(model.sequences.map((sequence) => sequence.name));
});

// target here is the resource for which the error occured.
// For global errors, this will be the viewer itself.
viewer.on('error', (target, error, reason) => {
  console.log(`Error: ${error}, Reason: ${reason}`, target);
});
```

Instances are also event emitters.
An MDX/M3 instance will emit the `seqend` event every time it finishes its current animation.

```javascript
instance.on('seqend', (instance) => {
  console.log(`Finished running sequence ${instance.model.sequences[instance.sequence].name}`);
});
```
