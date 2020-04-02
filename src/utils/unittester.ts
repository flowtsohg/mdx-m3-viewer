// @ts-ignore
import * as resemble from '../../thirdparty/resemble';
import seededRandom from '../common/seededrandom';
import { blobToImage } from '../common/canvas';
import ModelViewer from '../viewer/viewer';
import { Resource } from '../viewer/resource';
import Scene from '../viewer/scene';
import Camera from '../viewer/camera';
import mdxHandler from '../viewer/handlers/mdx/handler';
import m3Handler from '../viewer/handlers/m3/handler';
import geoHandler from '../viewer/handlers/geo/handler';

/**
 * The signature of a test loader.
 * 
 * The returned data will be passed to the handler.
 */
type TestLoader = (viewer: ModelViewer) => any;

/**
 * The signature of a test handler.
 */
type TestHandler = (viewer: ModelViewer, scene: Scene, camera: Camera, data: any) => void;

/**
 * The recursive test structure passed to the unit tester.
 * 
 * In reality either `load` and `test` should be defined, or `tests` should be defined.
 */
interface RecursiveTest {
  name: string;
  load?: TestLoader;
  test?: TestHandler;
  tests?: RecursiveTest[];
}

/**
 * The internal type used by the tester.
 */
interface Test {
  name: string;
  test: RecursiveTest;
}

/**
 * The result given to the callback when running the tests.
 */
interface TestResult {
  done: boolean;
  value?: {
    name: string;
    testImage?: HTMLImageElement;
    comparisonImage?: HTMLImageElement;
    result: number;
  }
}

/**
 * The result given to the callback when downloading the tests.
 */
interface DownloadResult {
  done: boolean;
  value?: {
    name: string;
    blob?: Blob;
  }
}

interface ResembleResult {
  rawMisMatchPercentage: number;
}

/**
 * A unit tester designed for the model viewer.
 * The input of each test is a pre-defined scene, and the output is the rendered image.
 * The image is then compared to another image generated from the same test, at a time when rendering it was considered "correct".
 */
export default class UnitTester {
  viewer: ModelViewer;
  mathRandom: () => number = Math.random;
  tests: Test[] = [];

  constructor() {
    let canvas = document.createElement('canvas');

    canvas.width = canvas.height = 256;

    let viewer = new ModelViewer(canvas, { alpha: false, antialias: false });

    viewer.gl.clearColor(0.05, 0.05, 0.05, 1);

    viewer.on('error', (target, error, reason) => console.log(target, error, reason));

    viewer.addHandler(mdxHandler);
    viewer.addHandler(m3Handler);
    viewer.addHandler(geoHandler);

    this.viewer = viewer;
  }

  /**
   * Add a test or a hierarchy of tests.
   */
  add(test: RecursiveTest) {
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
  async test(callback: (testResult: TestResult) => void) {
    for (let test of this.tests) {
      let testBlob = await this.getTestBlob(test);
      let comparisonBlob = await this.getComparisonBlob(test);

      if (testBlob && comparisonBlob) {
        let comparisonResult = await new Promise((resolve: (data: ResembleResult) => void) => resemble(testBlob).compareTo(comparisonBlob).ignoreColors().onComplete((data: ResembleResult) => resolve(data)));
        let testImage = await blobToImage(testBlob);
        let comparisonImage = await blobToImage(comparisonBlob);

        callback({ done: false, value: { name: test.name, testImage, comparisonImage, result: comparisonResult.rawMisMatchPercentage } });
      } else {
        // Fail modes.
        // 1) The test blob exists, but comparison doesn't. This happens when adding new tests.
        // 2) The comparison blob exists, but the test doesn't. This happens when having issues with fetching the files needed for the tests.
        // 3) Neither exists.
        if (testBlob) {
          callback({ done: false, value: { name: test.name, testImage: await blobToImage(testBlob), result: 100 } });
        } else if (comparisonBlob) {
          callback({ done: false, value: { name: test.name, comparisonImage: await blobToImage(comparisonBlob), result: 100 } });
        } else {
          callback({ done: false, value: { name: test.name, result: 100 } });
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
  async download(callback: (testResult: DownloadResult) => void) {
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
  isDataAGo(data: Resource | Resource[]) {
    if (data) {
      if (Array.isArray(data)) {
        for (let resource of data) {
          if (!resource.ok) {
            return false;
          }
        }

        return true;
      }

      return data.ok;
    }

    return false;
  }

  /**
   * Given a test, return a promise that will resolve to the blob that resulted from running the test.
   */
  async getTestBlob(test: Test) {
    let loadHandler = <TestLoader>test.test.load;
    let testHandler = <TestHandler>test.test.test;
    let viewer = this.viewer;

    // Clear the viewer
    viewer.clear();

    let scene = viewer.addScene();
    let camera = scene.camera;

    // Setup the camera
    camera.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
    camera.perspective(Math.PI / 4, 1, 8, 100000);

    // Start loading the test.
    let data = loadHandler(viewer);

    // Wait until everything loaded.
    await viewer.whenAllLoaded();

    if (this.isDataAGo(data)) {
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
  }

  /**
   * Given a test, return a promise that will resolve to the comparison image of this test.
   */
  async getComparisonBlob(test: Test) {
    let response = await fetch(`compare/${test.name}.png`);

    if (response.ok) {
      return await response.blob();
    }
  }

  /**
   * Adds tests from an hierarchy while appending their names.
   * Called automatically by add() if needed.
   */
  addBaseName(tests: RecursiveTest[], baseName: string) {
    for (let test of tests) {
      if (test.tests) {
        this.addBaseName(test.tests, baseName + '-' + test.name);
      } else {
        this.tests.push({ name: baseName + '-' + test.name, test });
      }
    }
  }
}
