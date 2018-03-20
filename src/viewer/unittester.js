import seededRandom from '../common/seededrandom';
import { getImageData } from '../common/canvas';
import ModelViewer from './viewer';
import Scene from './scene';
import W3x from './handlers/w3x/handler';
import M3 from './handlers/m3/handler';

export default class UnitTester {
    constructor() {
        let canvas = document.createElement('canvas');

        canvas.width = canvas.height = 256;

        let viewer = new ModelViewer(canvas);

        viewer.gl.clearColor(0, 0, 0, 1);

        viewer.addEventListener('error', (e) => console.log(e));

        viewer.addHandler(W3x);
        viewer.addHandler(M3);

        viewer.noCulling = true;

        this.canvas = canvas;
        this.viewer = viewer;
        this.mathRandom = Math.random;
        this.tests = [];
    }

    // Download an url to a file with the given name.
    // The name doesn't seem to work in Firefox (only tested in Firefox and Chrome on Windows).
    downloadUrl(url, name) {
        let a = document.createElement('a');
        
        a.href = url;
        a.download = `${name}.png`;

        a.dispatchEvent(new MouseEvent('click'));
    }

    comparePixels(a, b, callback) {
        let imageA = new Image(),
            imageB = new Image(),
            loadedA = false,
            loadedB = false;

        let whenBothLoaded = () => {
            if (imageA.width !== imageB.width || imageA.height !== imageB.height) {
                callback(imageA, imageB, false);
                return;
            }

            let dataA = getImageData(imageA).data,
                dataB = getImageData(imageB).data;

            for (let i = 0, l = dataA.length; i < l; i++) {
                if (dataA[i] !== dataB[i]) {
                    callback(imageA, imageB, false);
                    return;
                }
            }

            callback(imageA, imageB, true);
        }

        imageA.onload = () => {
            loadedA = true;

            if (loadedB) {
                whenBothLoaded();
            }
        };

        imageB.onload = () => {
            loadedB = true;

            if (loadedA) {
                whenBothLoaded();
            }
        };

        // When adding new tests, avoid getting stuck.
        imageB.onerror = imageB.onload;

        imageA.src = a;
        imageB.src = b;
    }

    // Run the tests and compare the results against the (hopefully) correct images located on the server.
    // The given callback gets called after each comparison, with the result data.
    run(callback) {
        this.start(function loop(entry, iterator, blob, tester) {
            if (!entry.done) {
                let name = entry.value[1].name,
                    url = URL.createObjectURL(blob),
                    compare = 'compare/' + name + '.png';

                tester.comparePixels(url, compare, function (imgA, imgB, result) {
                    callback({ value: [name, { a: imgA, b: imgB, result }], done: entry.done });

                    tester.next(loop, iterator);
                });
            } else {
                callback(entry);
            }
        });
    }

    // Download all of the test results as PNG images.
    // Behavior depends on the browser - on Chrome (at least on Windows), the images will be downloaded automatically to the default download location, each having the name of the test.
    // E.g. 'mdx-load' -> 'mdx-load.png'.
    downloadTestResults(callback) {
        this.start(function loop(entry, iterator, blob, tester) {
            if (!entry.done) {
                tester.downloadUrl(URL.createObjectURL(blob), entry.value[1].name);

                callback(entry);

                tester.next(loop, iterator);
            } else {
                callback(entry);
            }
        });
    }

    // Add tests
    add(test) {
        if (typeof test.test === 'function') {
            this.tests.push({ name: test.name, test });
        } else if (test.tests) {
            this.addBaseName(test.tests, test.name);
        }
    }

    addBaseName(tests, baseName) {
        for (let test of tests) {
            if (typeof test.test === 'function') {
                this.tests.push({ name: baseName + '-' + test.name, test });
            } else if (test.tests) {
                this.addBaseName(test.tests, baseName + '-' + test.name);
            }
            
        }
    }

    // Start running tests
    start(callback) {
        this.next(callback, this.tests.entries());
    }

    // Run the next test
    next(callback, iterator) {
        let entry = iterator.next();

        if (entry.done) {
            callback(entry, iterator, null);
        } else {
            let viewer = this.viewer,
                scene = new Scene(),
                camera = scene.camera,
                test = entry.value[1].test;

            // Clear the viewer
            viewer.clear();
            viewer.addScene(scene);
            
            // Setup the camera
            camera.setViewport([0, 0, viewer.canvas.width, viewer.canvas.height]);
            camera.setPerspective(Math.PI / 4, 1, 8, 100000);
            camera.resetTransformation();

            // Start loading the test.
            let data = test.load(viewer);
            
            // Wait until everything loaded.
            viewer.whenAllLoaded(() => {
                // Replace Math.random with a custom seeded random generator.
                // This allows to run the viewer in a deterministic environment for tests.
                // For example, particles have some randomized data, which can make tests mismatch.
                Math.random = seededRandom(6);

                // Run the test.
                test.test(viewer, scene, camera, data);

                // Update the viewer.
                // Do it twice to ensure all of the internal viewer state finished loading (e.g. buckets)
                viewer.update();
                viewer.update();

                // Render the viewer
                viewer.render();

                // Put back Math.random in its place.
                Math.random = this.mathRandom;

                viewer.toBlob((blob) => {
                    callback(entry, iterator, blob, this);
                });
            });
        }
    }
};
