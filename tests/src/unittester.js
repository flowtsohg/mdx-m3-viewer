function UnitTester() {
    let canvas = document.createElement("canvas");

    canvas.width = canvas.height = 512;

    let viewer = new ModelViewer(canvas);

    viewer.addHandler(W3x);
    viewer.addHandler(M3);
    viewer.addEventListener("error", (e) => console.log(e));
    viewer.paused = true; // The viewer will be manually controlled anyway, might as well not have it running all the time

    this.canvas = canvas;
    this.viewer = viewer;
    this.tests = new Map();
    this.mathRandom = Math.random;
}

UnitTester.prototype = {
    // Run the tests and compare the results against the (hopefully) correct images located on the server.
    // The given callback gets called after each comparison, with the result data.
    run(callback) {
        this.replaceMathRandom();

        this.start((entry) => {
            if (!entry.done) {
                this.getRenderedAsUrl((url) => {
                    let name = entry.value[0];

                    resemble(url).compareTo("tests/" + name + ".png").onComplete(function (data) {
                        callback({ value: [name, { data, imageSrc: url, testImageSrc: name + ".png" }], done: entry.done });
                    });

                    this.next();
                });
            } else {
                callback(entry);
            }
        });
    },

    // Download all of the test results as PNG images.
    // Behavior depends on the browser - on Chrome (at least on Windows), the images will be downloaded automatically to the default download location, each having the name of the test.
    // E.g. "mdx-load" -> "mdx-load.png".
    downloadTestResults() {
        this.start((entry) => {
            if (!entry.done) {
                this.getRenderedAsUrl((url) => {
                    this.downloadUrl(url, entry.value[0]);
                });

                this.next();
            }
        });
    },

    // Add a new test
    addTest(name, test) {
        this.tests.set(name, test);
    },

    // Start running tests
    start(callback) {
        this.callback = callback;
        this.iterator = this.tests.entries();

        this.next();
    },

    // Run the next test
    next() {
        let viewer = this.viewer,
            entry = this.iterator.next();

        if (entry.done) {
            this.callback(entry);
        } else {
            // Clear the viewer
            viewer.clear();

            this.replaceMathRandom();

            // Run the test code
            entry.value[1](viewer);

            viewer.whenAllLoaded(() => {
                // Update the viewer once to make all of the changes appear
                viewer.updateAndRender();

                this.resetMathRandom();

                this.callback(entry);
            });
        }
    },

    /// TODO: Move out of here
    // Get a Blob representing the viewer's canvas.
    // Warning: because browsers do funny business with the internal buffer of WebGL contexts, HTMLCanvasElement.toBlob() can't be called regularily.
    // That is, if you call this function with the viewer running, the resulting blob will probably represent a completely black image.
    // If you do need a blob when running the viewer in real time (ModelViewer.paused === false), get it in a "render" event listener, where the internal canvas buffer is still valid.
    getBlob(callback) {
        this.canvas.toBlob((blob) => callback(blob));
    },

    /// TODO: Move out of here
    // Download what is currently rendered by the viewer, with the given file name.
    // The name doesn't seem to work in Firefox (only tested in Firefox and Chrome on Windows).
    downloadUrl(url, name) {
        let a = document.createElement("a");

        a.href = url;
        a.download = name;

        a.dispatchEvent(new MouseEvent("click"));
    },

    /// TODO: Move out of here
    // Get what is currently rendered by the viewer, as an URL.
    // Will call callback with the resulting URL.
    getRenderedAsUrl(callback) {
        this.getBlob((blob) => {
            callback(URL.createObjectURL(blob));
        });
    },

    /// TODO: Move out of here
    // Get what is currently renderd by the viewer, as an Image object.
    // Will call callback with the resulting Image.
    getRenderedAsImage(callback) {
        this.getRenderedAsUrl((url) => {
            let image = new Image();

            image.addEventListener("load", (e) => {
                callback(image);
            });

            image.src = url;
        });
    },

    // Replace Math.random with a custom RNG that allows to set the seed, and use an arbitrary constant seed.
    // This allows to run the viewer in a deterministic environment for tests.
    // For example, particles have some randomized data, which can make tests mismatch.
    // Function taken from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    // I simplified it so it will be a direct replacement for Math.random.
    replaceMathRandom() {
        let seed = 6;
        
        Math.random = function () {
            seed = (seed * 9301 + 49297) % 233280;

            return seed / 233280;
        };

        
    },

    resetMathRandom() {
        Math.random = this.mathRandom;
    }
};
