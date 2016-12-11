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
}

UnitTester.prototype = {
    start(callback) {
        this.callback = callback;
        this.iterator = this.tests.entries();

        this.next(callback);
    },

    next() {
        let viewer = this.viewer,
            entry = this.iterator.next();

        if (entry.done) {
            this.callback(entry);
        } else {
            // Clear the viewer
            viewer.clear();

            // Run the test code
            entry.value[1](viewer);

            viewer.whenAllLoaded(() => {
                // Update the viewer once to make all of the changes appear
                viewer.updateAndRender();

                this.callback(entry);
            });
        }
    },

    saveTests(callback) {
        this.start((entry) => {
            if (!entry.done) {
                this.downloadImage(entry.value[0]);

                callback(entry);

                this.next();
            } else {
                callback(entry);
            }
        });
    },

    runTests(callback) {
        this.start((entry) => {
            if (!entry.done) {
                this.getImageUrl((url) => {
                    let name = entry.value[0];

                    resemble(url).compareTo("tests/" + name + ".png").onComplete(function (data) {
                        callback({ value: [name, {data, imageSrc: url, testImageSrc: name + ".png"}], done: entry.done });
                    });

                    this.next();
                });
            } else {
                callback(entry);
            }
        });
    },

    addTest(name, test) {
        this.tests.set(name, test);
    },

    getBlob(callback) {
        this.canvas.toBlob((blob) => callback(blob));
    },

    downloadImage(name) {
        this.getBlob((blob) => {
            let a = document.createElement("a"),
                    url = URL.createObjectURL(blob);

            a.href = url;
            a.download = name;

            a.dispatchEvent(new MouseEvent("click"));

            URL.revokeObjectURL(url);
        });
    },

    getImage(callback) {
        this.getBlob((blob) => {
            let url = URL.createObjectURL(blob),
                image = new Image();

            image.addEventListener("load", (e) => {
                //URL.revokeObjectURL(url);
                callback(e.target);
            });

            image.src = url;
        });
    },

    getImageUrl(callback) {
        this.getBlob((blob) => {
            callback(URL.createObjectURL(blob));
        });
    }
};
