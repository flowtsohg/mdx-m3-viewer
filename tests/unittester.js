function UnitTester() {
    let canvas = document.createElement("canvas");

    canvas.width = canvas.height = 256;

    let viewer = new ModelViewer(canvas);

    viewer.gl.clearColor(0.1, 0.1, 0.1, 1);

    viewer.addEventListener("error", (e) => console.log(e));

    viewer.addHandler(W3x);
    viewer.addHandler(M3);

    viewer.addEventListener("loadstart", (e) => console.log(e));
    viewer.addEventListener("loadend", (e) => console.log(e));

    this.viewer = viewer;
    this.mathRandom = Math.random;
    this.tests = [];
};

UnitTester.prototype = {
    // Replace Math.random with a custom seeded random generator.
    // This allows to run the viewer in a deterministic environment for tests.
    // For example, particles have some randomized data, which can make tests mismatch.
    replaceMathRandom() {
        Math.random = seededRandom(6);
    },

    // Reset Math.random to the original function
    resetMathRandom() {
        Math.random = this.mathRandom;
    },

    // Run the tests and compare the results against the (hopefully) correct images located on the server.
    // The given callback gets called after each comparison, with the result data.
    run(callback) {
        this.start(function loop(entry, iterator, blob, tester) {
            if (!entry.done) {
                let name = entry.value[1][0],
                    url = URL.createObjectURL(blob),
                    compare = "compare/" + name + ".png";

                compareImagesFromURLs(url, compare, function (imgA, imgB, result) {
                    callback({ value: [name, { a: imgA, b: imgB, result }], done: entry.done });

                    tester.next(loop, iterator);
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
        this.start(function loop(entry, iterator, blob, tester) {
            if (!entry.done) {
                downloadUrl(URL.createObjectURL(blob), entry.value[1][0]);

                tester.next(loop, iterator);
            }
        });
    },

    // Add tests
    addTests(tests) {
        for (let test of tests) {
            this.tests.push(test);
        }
    },

    // Start running tests
    start(callback) {
        this.next(callback, this.tests.entries());
    },

    // Run the next test
    next(callback, iterator) {
        let entry = iterator.next();

        if (entry.done) {
            callback(entry, iterator, null);
        } else {
            let viewer = this.viewer;

            // Clear the viewer
            viewer.clear();

            let scene = new Scene();
            let camera = scene.camera;

            camera.setViewport([0, 0, viewer.canvas.width, viewer.canvas.height]);
            camera.setPerspective(Math.PI / 4, 1, 8, 100000);

            viewer.addScene(scene);

            // Replace Math.random with a custom seeded random function
            this.replaceMathRandom();

            console.log("Running test", entry.value[1][0]);
            // Run the test code
            entry.value[1][1](viewer, scene);

            viewer.whenAllLoaded(() => {
                console.log("viewer.whenAllLoaded()")
                // Update the viewer once to make all of the changes appear
                viewer.update();

                // And a second update, becuase otherwise the viewer is empty????
                viewer.update();

                // Render the viewer
                viewer.render();

                // Put back Math.random in its place before client code is called
                this.resetMathRandom();

                viewer.toBlob((blob) => {
                    callback(entry, iterator, blob, this);
                });
            });
        }
    }
};
