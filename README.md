mdx-m3-viewer
=============

A WebGL viewer for MDX and M3 files used by the games Warcraft 3 and Starcraft 2 respectively.

Running compiler.rb creates a standalone minified JavaScript file that can be included to any HTML page.
To minify the GLSL shaders, use [glsl-minifier](https://github.com/flowtsohg/glsl-minifier).
To minify the resulting JavaScript, use the [Google Closure compiler](https://developers.google.com/closure/compiler/).
Both options can be disabled or enabled in compiler.rb.

Note: you must run compiler.rb to get a working file, since there are broken files that must be concatenated to form valid JavaScript files (look at before.js and after.js files to understand what I mean).

A live version can be seen on [Hiveworkshop](http://www.hiveworkshop.com) for which this viewer was made.

Usage: `new Viewer(args)`

args is an Object with the following properties:

    canvas - A <canvas> element
    onprogress - A function callback. Progress messages will be sent to it. Optional.
    onload - A function callback. Called if everything went ok, and the model was loaded successfully. Optional.
    onerror - A function callback. Called if there was an error somewhere.
    MODEL_ID - The model ID. Used by the Hiveworkshop.
    MODEL_PATH - A path to a MDX or M3 file to use.
    MPQ_PATH - A path to a MDX or M3 file in the Warcraft 3 / Starcraft 2 MPQs. Used by the Hiveworkshop.
    DEBUG_MODE - If exists and true, the viewer will log the Parser and Model structures. Optional.
  
One of MODEL_ID / MODEL_PATH / MPQ_PATH has to be defined.
If more than one is defined, the order of preference is MODEL_PATH > MPQ_PATH > MODEL_ID.
