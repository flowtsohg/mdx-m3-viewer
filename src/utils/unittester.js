import seededRandom from '../common/seededrandom';
import { imageToImageData, blobToImage } from '../common/canvas';
import { downloadBlob } from '../common/download';
import ModelViewer from '../viewer/viewer';
import Scene from '../viewer/scene';
import Mdx from '../viewer/handlers/mdx/handler';
import M3 from '../viewer/handlers/m3/handler';
import Geo from '../viewer/handlers/geo/handler';

export default class UnitTester {
    constructor() {
        let canvas = document.createElement('canvas');

        canvas.width = canvas.height = 256;

        let viewer = new ModelViewer(canvas, { alpha: false, antialias: false });

        viewer.gl.clearColor(0.05, 0.05, 0.05, 1);

        viewer.addEventListener('error', (e) => console.log(e));

        viewer.addHandler(Mdx);
        viewer.addHandler(M3);
        viewer.addHandler(Geo);

        viewer.noCulling = true;
        
        this.viewer = viewer;
        this.mathRandom = Math.random;
        this.tests = [];
    }

    add(test) {
        if (test.tests) {
            this.addBaseName(test.tests, test.name);
        } else {
            this.tests.push({ name: test.name, test });
        }
    }
    
    async test(callback) {
        for (let test of this.tests) {
            let testImage = await blobToImage(await this.getTestBlob(test)),
                comparisonImage = await this.getComparisonImage(test),
                result = this.compareImages(testImage, comparisonImage);

            callback({ done: false, value: { name: test.name, testImage, comparisonImage, result }});
        }

        callback({ done: true });
    }

    async download(callback) {
        for (let test of this.tests) {
            let testBlob = await this.getTestBlob(test);

            downloadBlob(testBlob, `${test.name}.png`);
        }

        callback({ done: true });
    }

    // Given a test, return a promise that will resolve to the blob that resulted from running the test.
    async getTestBlob(test) {
        let name = test.name,
            loadHandler = test.test.load,
            testHandler = test.test.test,
            viewer = this.viewer;

        // Clear the viewer
        viewer.clear();

        let scene = viewer.addScene(),
            camera = scene.camera;

        // Setup the camera
        camera.setViewport([0, 0, viewer.canvas.width, viewer.canvas.height]);
        camera.setPerspective(Math.PI / 4, 1, 8, 100000);
        camera.resetTransformation();

        // Start loading the test.
        let data = loadHandler(viewer);

        // Wait until everything loaded.
        await viewer.whenAllLoaded();

        // Replace Math.random with a custom seeded random generator.
        // This allows to run the viewer in a deterministic environment for tests.
        // For example, particles have some randomized data, which can make tests mismatch.
        Math.random = seededRandom(6);

        // Run the test.
        testHandler(viewer, scene, camera, data);

        // Update and render.
        viewer.updateAndRender();

        // Put back Math.random in its place.
        Math.random = this.mathRandom;

        // Return the viewer's canvas' blob.
        return await viewer.toBlob();
    }

    // Given a test, return a promise that will resolve to the comparison image of this test.
    getComparisonImage(test) {
        return new Promise((resolve, reject) => {
            let image = new Image();

            image.onload = () => {
                resolve(image);
            };

            image.onerror = () => {
                resolve(image);
            };

            image.src = 'compare/' + test.name + '.png';
        });
    }

    // Compares the size and every pixel of two images, and returns the result.
    compareImages(imageA, imageB) {
        if (imageA.width !== imageB.width || imageA.height !== imageB.height) {
            return false;
        }

        let a = imageToImageData(imageA).data,
            b = imageToImageData(imageB).data;

        for (let i = 0, l = a.length; i < l; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }

    addBaseName(tests, baseName) {
        for (let test of tests) {
            if (test.tests) {
                this.addBaseName(test.tests, baseName + '-' + test.name);
            } else {
                this.tests.push({ name: baseName + '-' + test.name, test });
            }

        }
    }
};
