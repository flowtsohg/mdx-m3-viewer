mdx-m3-viewer
=============

Originally a simple model viewer used to render MDX and M3 models, used by the games Warcraft 3 and Starcraft 2 respectively. 
Nowadays it is more of a general model viewer, that can handle any format the client can supply a handler for.
Built-in handlers exist for the following formats:
* MDX (Warcraft 3 model): extensive support, almost everything should work.
* M3 (Starcraft 2 model): partial support, file format not quite reverse engineered yet.
* W3M/W3X (Warcraft 3 map): partial support, will grow in future.
* BLP1 (Warcraft 3 texture): extensive support, almost everything should work.
* MPQ1 (Warcraft 3 archive): partial support, only inflate (which accounts for all models, textures, and table files, but no sound files or weird things).
* TGA (image): partial support, only simple 24bit images.
* SLK (table data): partial support, but will probably keep working for Warcraft 3 files.
* DDS (compressed texture, used by Starcraft 2): partial support, should work for every Starcraft 2 texture, and probably for most DDS files in existence (DXT1/3/5).
* PNG/JPG/GIF: supported as a wrapper around Image.
* GEO (a simple JS format used for geometric shapes): note that this is solely a run-time handler.

To get a single includeable file, run the given Ruby script in `compiler.rb`. This script gives you compilation options if you open it with a text editor, and will result in `viewer.min.js` getting generated, if you tell it to minify. Running it without changes will generate the minified version including all built-in handlers.

------------------------

#### Getting started

The examples directory has an example with partially working OBJ model and BMP texture handlers, I highly suggest looking at it first.

Probably the easiest way to get it running is by downloading Python.
Once you have it, run its built-in HTTP server from the main viewer directory.

Python 2.x: python -m SimpleHTTPServer 80

Python 3.x: python -m http.server 80

Next, go to your browser, and open `http://localhost/examples/`.

If you don't want to run an HTTP server, you can use the `file://` notation for local files, but note that you must enable local files in your browser settings (otherwise CORS will block the fetches). You really should run a server though.

------------------------

#### Usage

First, let's create the viewer.
```javascript
let viewer = new ModelViewer(canvas)
```

If the client doesn't have the WebGL requierments to run the viewer, an exception will be thrown when trying to create it.

When a new viewer instance is created, it doesn't yet support loading anything, since it has no handlers.
Handlers are simple JS objects with a specific signature, that give information to the viewer (such as a file format(s), and the implementation objects).
When you want to load something, the viewer will select the appropriate handler, if there is one, and use it to construct the object.

Let's add the MDX handler.
This handler handles MDX files, unsurprisingly. It also adds the SLK, BLP, and TGA handlers automatically, since it requires them.

```javascript
viewer.addHandler(Mdx);
```

Finally for the initial setup, the viewer's camera is right at the origin, so let's move it a little.
```javascript
viewer.camera.move([0, 0, -500);
```

So how do you actually load models and other files?
The model viewer uses a system of path solving functions.
That is, you supply a function that takes a source you want to load, such as an url, and you need to return specific results so the viewer knows what to do.
The load function itself looks like this:

```javascript
let resource = viewer.load(src|src[], pathSolver)
```

In other words, you give it either a source, or an array of sources, and the path solver.
If a single source is given, a single resource will be returned.
If an array is given, an array will be returned, with the same ordering.
A resource in this context means a model, a texture, or a generic file (any handler that is not a model or texture handler, such as SLK).

The source here can be anything - a string, an object, a typed array, whatever - it highly depends on your code, and on the path solver.
Generally speaking though, the source will probably be a string containing an url.

The path solver is a function with this signature: `function(src) => [finalSrc, srcExtension, isServerFetch]`, where:
* `src` is the source (or iteratively an array of sources) you gave the load call.
* `finalSrc` is the actual source to load from. If this is a server fetch, then this is the url to fetch from.
If it's an in-memory load, it depends on what each handler requires.
* `srcExtension` is the extension of the resource you are loading, which selects the handler to use. The extension is given in a ".ext" format.
That is, a string that contains a dot, followed by the extension.
Generally speaking, this will usually be the extension of an url.
* `isServerFetch` is a boolean, and will determine if this is an in-memory load, or a server fetch. This will usually be true.

So let's use an example.

Suppose we have the following directory structure:

```
index.html
Resources
	model.mdx
	texture.blp
```

And suppose we know that `model.mdx` uses the texture `texture.blp`.

Let's see how a possible path solver could look.
I'll make it assume it's getting urls, and automatically prepend "Resources/" to sources.

```javascript
function myPathSolver(path) {
	return ["Resources/" + path, SomeFunctionThatGetsFileExtensions(path), true];
}
```

Now let's try to load the model.

```javascript
let model = viewer.load("model.mdx", myPathSolver);
```

This function call results in the following chain of events:

1. myPathSolver is called with `"model.mdx"` and returns `["Resources/model.mdx", ".mdx", true]`.
2. The viewer chooses the correct handler based on the extension - in this case the MDX handler - sees this is a server fetch, and uses the source for the fetch.
3. A new MDX model is created and starts loading (at this point the viewer gets a `loadstart` event from the model).
4. The model is returned.
5. ...time passes until the model finishes loading...(meanwhile, the model sends `progress` events, if it's a server fetch)
6. The model is constructed successfuly, or not, and sends a `load` or `error` event respectively, followed by the `loadend` event.
7. In the case of a MDX model, the previous step will also cause it to load its textures, in this case `texture.blp`.
8. myPathSolver is called with `texture.blp`, which returns `["Resources/texture.blp", ".blp", true]`, and we loop back to step 2, but with a texture this time.

The path solver does two jobs here. First of all, it made the load calls shorter by avoiding to type "Resources/". But the real deal, is that it allows to selectively override sources, and change them in interesting ways.
In this case, it allowed `model.mdx` to load `texture.blp`, wnich is a relative path. If the path would have been given directly, then the file wouldn't have been found.
Generally speaking, an identity solver is what you'll need (as in, it returns the source assuming its an url but prepended by some directory, its extension, and true for server fetch), but there are cases where this is not the case, such as loading custom user-made models, handling both in-memory and server-fetches in the same solver (used by the W3X handler), etc.

So, we now have a model, but a model isn't something you can see. What you see in a scene are instances of a model.
Creating a new instance is as simple as this:

```javascript
let instance = model.addInstance();
```

This instance can be rendered, moved, rotated, scaled, parented to other instances or nodes, play animations, and so on.

------------------------

#### Async everywhere I go

A big design part of this viewer is that it tries to allow you to write as linear code as you can.
That is, even though this code heavily relies on asyncronous actions (and not only in server fetches, you'd be surprised), it tries to hide this fact, and make the code feel syncronous to the client.

For example, let's say we want the instance above to play an animation, assuming its model has any.

```javascript
instance.setSequence(0); // first animation, -1 == no animation.
```

This method needs to get animation data from the model, which, if all of this code is put together, is not loaded yet! (even if you run locally, the file fetch will finish after this line).
In fact, even constructing the instance itself with `model.addInstance()` is an asyncronous action - the model doesn't need to be loaded for instances of it to exist, and for you to be able to manipulate them.
Generally speaking, whenever you want to set/change something, you will be able to do it with straightforward code that looks syncronous, whether it really is or not behind the scenes.

If you want to get any information from the model, like a list of animations, or textures, then the model obviously needs to exist before.
For this reason, there are two ways to react to resources being loaded.
First of all, as the next section explains (and as is mentioned above), every resource uses event dispatching, much like regular asyncronous JS objects (Image, XMLHttpRequest, and so on).
In addition, every resource has a `whenLoaded(callback)` method that calls `callback` when the resource loads, or immediately if it was already loaded.
The viewer itself has `whenAllLoaded(resources, callback)`, which is the same, but waits for multiple resources in an array to load.

------------------------

#### Events

Resources, including the viewer, can send events, very similar to those of native JS objects, and with the same API:

```
resource.addEventListener(type, listener)
resource.removeEventListener(type, listener)
resource.dispatchEvent(event)
```

When an event listener is attached to a specific resource, such as a model, it only gets events from that object.
If, however, a listener is attached to the viewer itself, it will receive events for all resources.

Note that attaching a `loadstart` listener to a resource that is not the viewer is pointless, since the listener is registered after the resource started loading.

The type can be one of:
* `render` - called every frame after rendering is done (this event is only dispatched by the viewer).
* `loadstart` - a resource started loading.
* `progress` - progress updates for loads. The `loaded`, `total`, and `lengthComputable` properties will be set.
* `load` - a resource finished loading.
* `error` - an error occured when loading a resource. The `error` property will be set.
* `loadend` - sent when a resource finishes loading, either because of an error, or because it loaded successfully.
* `delete` - a resource was deleted.

The event object that a listener recieves has the same structure as JS events.
For example, for the load call above, the following is how a `progress` event could look: `{type: "progress", target: MdxModel, loaded: 101, total: 9001, lengthComputable: true}`, `MdxModel` being our `model` variable in this case. That is, `e.target === model`.
In the case of the render event, `e.target === viewer`.

Errors might occur - most of the time because your path solvers aren't correct, but there are other causes.
These are the errors the code uses:
* InvalidHandler - sent by the viewer when adding an invalid handler - either its type is unknown, or its `initialize()` function failed (e.g. a shader failed to compile).
* MissingHandler - sent by the viewer if you try to load some resource with an unknown extension (did you forget to add the handler?).
* HttpError - sent by handlers when a server fetch failed.
* InvalidSource - sent by handlers when they think your source is not valid, such as trying to load a file as MDX, but it's not really an MDX file.
* UnsupportedFeature - sent by handlers when the source is valid, but a feature in the format isn't supported, such as DDS textures not supporting encodings that are not DXT1/3/5.

Together with these error strings (in the `error` property naturally), more information can be added in the `extra` property.
For example, when you get a MissingHandler error because you tried loading an unknown extension, the `extra` property will hold the result from your path solver.
Another example - when an HttpError occurs, `extra` will contain the XMLHttpRequest object of the fetch.
You can choose to respond to errors (or not) however you want.
