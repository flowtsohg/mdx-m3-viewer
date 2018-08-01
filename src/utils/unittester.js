import * as resemble from '../../thirdparty/resemble';
import seededRandom from '../common/seededrandom';
import {imageToImageData, blobToImage} from '../common/canvas';
import {downloadBlob} from '../common/download';
import ModelViewer from '../viewer/viewer';
import Mdx from '../viewer/handlers/mdx/handler';
import M3 from '../viewer/handlers/m3/handler';
import Geo from '../viewer/handlers/geo/handler';

/**
 * A unit tester designed for the model viewer.
 * The input of each test is a pre-defined scene, and the output is the rendered image.
 * The image is then compared to another image generated from the same test, at a time when rendering it was considered "correct".
 *
 * Note: it looks like this tester cannot be completely dependant on.
 *     This is because different computers (and even different browsers on the same computer) render slightly different.
 */
export default class UnitTester {
  /**
   *
   */
  constructor() {
    let canvas = document.createElement('canvas');

    canvas.width = canvas.height = 256;

    let viewer = new ModelViewer(canvas, {alpha: false, antialias: false});

    viewer.gl.clearColor(0.05, 0.05, 0.05, 1);

    viewer.on('error', (target, error, reason) => console.log(target, error, reason));

    viewer.addHandler(Mdx);
    viewer.addHandler(M3);
    viewer.addHandler(Geo);

    viewer.noCulling = true;

    this.viewer = viewer;
    this.mathRandom = Math.random;
    this.tests = [];
  }

  /**
   * Add a test or a hierarchy of tests.
   *
   * @param {Object} test
   */
  add(test) {
    if (test.tests) {
      this.addBaseName(test.tests, test.name);
    } else {
      this.tests.push({name: test.name, test});
    }
  }

  /**
   * Run all of the tests that were added.
   * The callback will be called with the result of each one.
   * The results look like iterators: {done: true/false, value: undefine/result }.
   *
   * @param {function} callback
   */
  async test(callback) {
    for (let test of this.tests) {
      let testBlob = await this.getTestBlob(test);
      let comparisonBlob = await this.getComparisonBlob(test);

      if (comparisonBlob) {
        let comparisonPromise = new Promise((resolve) => resemble(testBlob).compareTo(comparisonBlob).ignoreColors().onComplete((data) => resolve(data)));
        let [testImage, comparisonImage, testResult] = await Promise.all([blobToImage(testBlob), blobToImage(comparisonBlob), comparisonPromise]);

        callback({done: false, value: {name: test.name, testImage, comparisonImage, result: testResult.rawMisMatchPercentage}});
      } else {
        // When adding new tests, or not having the comparison images yet, the above will fail.
        // In this case, always return the test image, and make it fail 100%.
        callback({done: false, value: {name: test.name, testImage: await blobToImage(testBlob), result: 100}});
      }
    }

    callback({done: true});
  }

  /**
   * Run all of the tests that were added, and download them.
   * The tests are not compared against anything.
   * This is used to update the "correct" results.
   *
   * @param {function} callback
   */
  async download(callback) {
    for (let test of this.tests) {
      let testBlob = await this.getTestBlob(test);

      downloadBlob(testBlob, `${test.name}.png`);

      callback({done: false, value: {name: test.name}});
    }

    callback({done: true});
  }

  /**
   * Given a test, return a promise that will resolve to the blob that resulted from running the test.
   *
   * @param {Object} test
   * @return {Promise}
   */
  async getTestBlob(test) {
    let loadHandler = test.test.load;
    let testHandler = test.test.test;
    let viewer = this.viewer;

    // Clear the viewer
    viewer.clear();

    let scene = viewer.addScene();
    let camera = scene.camera;

    // Setup the camera
    camera.viewport([0, 0, viewer.canvas.width, viewer.canvas.height]);
    camera.perspective(Math.PI / 4, 1, 8, 100000);

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

  /**
   * Given a test, return a promise that will resolve to the comparison image of this test.
   *
   * @param {Object} test
   * @return {Promise}
   */
  async getComparisonBlob(test) {
    let response = await fetch(`compare/${test.name}.png`);

    if (response.ok) {
      return await response.blob();
    }
  }

  /**
   * Compares two images.
   *
   * @param {Image} imageA
   * @param {Image} imageB
   * @return {boolean}
   */
  compareImages(imageA, imageB) {
    if (imageA.width !== imageB.width || imageA.height !== imageB.height) {
      return false;
    }

    let a = imageToImageData(imageA).data;
    let b = imageToImageData(imageB).data;

    for (let i = 0, l = a.length; i < l; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Adds tests from an hierarchy will appending their names.
   * Called automatically by add() if needed.
   *
   * @param {Array<Object>} tests
   * @param {string} baseName
   */
  addBaseName(tests, baseName) {
    for (let test of tests) {
      if (test.tests) {
        this.addBaseName(test.tests, baseName + '-' + test.name);
      } else {
        this.tests.push({name: baseName + '-' + test.name, test});
      }
    }
  }
}
