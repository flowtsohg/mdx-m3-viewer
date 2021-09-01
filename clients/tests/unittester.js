import * as resemble from '../thirdparty/resemble';
import seededRandom from '../../src/common/seededrandom';
import { blobToImage } from '../../src/common/canvas';
import ModelViewer from '../../src/viewer/viewer';
import mdxHandler from '../../src/viewer/handlers/mdx/handler';
import blpHandler from '../../src/viewer/handlers/blp/handler';
import ddsHandler from '../../src/viewer/handlers/dds/handler';
import tgaHandler from '../../src/viewer/handlers/tga/handler';
import m3Handler from '../../src/viewer/handlers/m3/handler';

/**
 * A unit tester designed for the model viewer.
 * The input of each test is a pre-defined scene, and the output is the rendered image.
 * The image is then compared to another image generated from the same test, at a time when rendering it was considered "correct".
 */
export default class UnitTester {
  constructor(wc3PathSolver) {
    let canvas = document.createElement('canvas');

    canvas.width = canvas.height = 256;

    let viewer = new ModelViewer(canvas, { alpha: false, antialias: false });

    viewer.gl.clearColor(0.05, 0.05, 0.05, 1);

    viewer.on('error', (e) => console.log(e));

    viewer.addHandler(mdxHandler, wc3PathSolver);
    viewer.addHandler(blpHandler);
    viewer.addHandler(ddsHandler);
    viewer.addHandler(tgaHandler);
    viewer.addHandler(m3Handler);

    this.viewer = viewer;
    this.mathRandom = Math.random;
    this.tests = [];
  }

  /**
   * Add a test or a hierarchy of tests.
   */
  add(test) {
    if (test.tests) {
      this.addBaseName(test.tests, test.name);
    } else {
      this.tests.push({ name: test.name, test });
    }
  }

  /**
   * Run all of the tests that were added.
   * The callback will be called with the result of each one.
   * The results look like iterators: {done: true/false, value: undefine/result }.
   */
  async test(callback) {
    for (let test of this.tests) {
      let testBlob = await this.getTestBlob(test);
      let comparisonBlob = await this.getComparisonBlob(test);

      if (testBlob && comparisonBlob) {
        let comparisonResult = await new Promise((resolve) => resemble(testBlob).compareTo(comparisonBlob).ignoreColors().onComplete((data) => resolve(data)));
        let testImage = await blobToImage(testBlob);
        let comparisonImage = await blobToImage(comparisonBlob);

        callback({ done: false, value: { name: test.name, testImage, comparisonImage, mismatchPercentage: comparisonResult.rawMisMatchPercentage } });
      } else {
        // Fail modes.
        // 1) The test blob exists, but comparison doesn't. This happens when adding new tests.
        // 2) The comparison blob exists, but the test doesn't. This happens when having issues with fetching the files needed for the tests.
        // 3) Neither exists.
        if (testBlob) {
          callback({ done: false, value: { name: test.name, testImage: await blobToImage(testBlob), mismatchPercentage: 100 } });
        } else if (comparisonBlob) {
          callback({ done: false, value: { name: test.name, comparisonImage: await blobToImage(comparisonBlob), mismatchPercentage: 100 } });
        } else {
          callback({ done: false, value: { name: test.name, mismatchPercentage: 100 } });
        }
      }
    }

    callback({ done: true });
  }

  /**
   * Run all of the tests that were added, and download them.
   * The tests are not compared against anything.
   * This is used to update the "correct" results.
   */
  async download(callback) {
    for (let test of this.tests) {
      let name = test.name;
      let blob = await this.getTestBlob(test);

      if (blob) {
        callback({ done: false, value: { name, blob } });
      } else {
        callback({ done: false, value: { name } });
      }
    }

    callback({ done: true });
  }

  /**
   * Is the given resource or array of resources ok?
   */
  isDataAGo(data) {
    if (data) {
      if (Array.isArray(data)) {
        for (let resource of data) {
          if (!resource) {
            return false;
          }
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Given a test, return a promise that will resolve to the blob that resulted from running the test.
   */
  async getTestBlob(test) {
    let loadHandler = test.test.load;
    let testHandler = test.test.test;
    let viewer = this.viewer;

    // Clear the viewer
    viewer.clear();

    let scene = viewer.addScene();

    scene.color.fill(0.05);

    // Start loading the test.
    let data = loadHandler(viewer);

    // Wait until everything loaded.
    await viewer.whenAllLoaded();

    if (Array.isArray(data)) {
      data = await Promise.all(data);
    } else {
      data = await data;
    }

    if (this.isDataAGo(data)) {
      // Replace Math.random with a custom seeded random generator.
      // This allows to run the viewer in a deterministic environment for tests.
      // For example, particles have some randomized data, which can make tests mismatch.
      Math.random = seededRandom(6);

      // Run the test.
      testHandler(viewer, scene, scene.camera, data);

      // Update and render.
      viewer.updateAndRender();

      // Put back Math.random in its place.
      Math.random = this.mathRandom;

      // Return the viewer's canvas' blob.
      return await viewer.toBlob();
    }
  }

  /**
   * Given a test, return a promise that will resolve to the comparison image of this test.
   */
  async getComparisonBlob(test) {
    let response = await fetch(`compare/${test.name}.png`);

    if (response.ok) {
      return await response.blob();
    }
  }

  /**
   * Adds tests from an hierarchy while appending their names.
   * Called automatically by add() if needed.
   */
  addBaseName(tests, baseName) {
    for (let test of tests) {
      if (test.tests) {
        this.addBaseName(test.tests, baseName + '-' + test.name);
      } else {
        this.tests.push({ name: baseName + '-' + test.name, test });
      }
    }
  }
}
