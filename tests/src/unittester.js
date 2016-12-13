function UnitTester() {
    let canvas = document.createElement("canvas");

    canvas.width = canvas.height = 512;

    let viewer = new ModelViewer(canvas);

    viewer.addHandler(W3x);
    viewer.addHandler(M3);
    viewer.addEventListener("error", (e) => console.log(e));

    this.canvas = canvas;
    this.viewer = viewer;
    this.tests = new Map();
    this.mathRandom = Math.random;
}

mix(UnitTester, {
    // ModelViewer.load, but waits for each resource to load, until the next one starts loading.
    // Can be used to run a simple JS test over a big list of sources, without hogging browser resources.
    loadSync(viewer, sources, pathSolver, callback) {
        this.loadResourceSync(viewer, callback, pathSolver, sources, 0, sources.length, new Date());
    },

    loadResourceSync(viewer, callback, pathSolver, sources, currentIndex, finalIndex, startTime) {
        let time = new Date() - startTime;

        if (currentIndex < finalIndex) {
            let resource = viewer.load(sources[currentIndex], pathSolver);

            resource.whenLoaded((resource) => {
                callback({ value: { sources, currentIndex, resource, time }, done: false });

                this.loadResourceSync(viewer, callback, pathSolver, sources, currentIndex + 1, finalIndex, startTime);
            });
        } else {
            callback({ value: { time }, done: true });
        }
    }
});

UnitTester.prototype = {
    // Run the tests and compare the results against the (hopefully) correct images located on the server.
    // The given callback gets called after each comparison, with the result data.
    run(callback) {
        this.start((entry) => {
            if (!entry.done) {
                this.viewer.toBlob((blob) => {
                    let url = URL.createObjectURL(blob),
                        name = entry.value[0];
                    
                    resemble(url).compareTo("tests/" + name + ".png").ignoreOutput().onComplete(function (data) {
                        callback({ value: [name, data], done: entry.done });
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
                this.viewer.toBlob((blob) => {
                    downloadUrl(URL.createObjectURL(blob), entry.value[0]);

                    this.next();
                });
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

            // Replace Math.random with a custom seeded random function
            this.replaceMathRandom();

            // Run the test code
            entry.value[1](viewer);

            viewer.whenAllLoaded(() => {
                // Update the viewer once to make all of the changes appear
                viewer.updateAndRender();

                // Put back Math.random in its place
                this.resetMathRandom();

                this.callback(entry);
            });
        }
    },

    // Replace Math.random with a custom seeded random generator.
    // This allows to run the viewer in a deterministic environment for tests.
    // For example, particles have some randomized data, which can make tests mismatch.
    replaceMathRandom() {
        Math.random = seededRandom(6);
    },

    // Reset Math.random to the original function
    resetMathRandom() {
        Math.random = this.mathRandom;
    }
};
