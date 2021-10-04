import { basename, extname } from "../../../src/common/path";
import War3Map from "../../../src/parsers/w3x/map";
import Component from "../../shared/component";
import Toggle from "../../shared/components/toggle";
import { createElement, hideElement, showElement } from "../../shared/domutils";
import localOrHive from "../../shared/localorhive";
import { getAllFileEntries, readFile, readEntry } from "../../shared/utils";
import Test from "../test";
import Logger from "./logger";
import Viewer from "./viewer";

export default class SanityTester extends Component {
  constructor(parentElement) {
    super({ className: 'client' });

    this.tests = [];
    this.visibleTest = null;

    // Tests header
    let testsHeader = createElement({ className: 'tests-header', container: this.container });
    createElement({ tagName: 'h1', textContent: 'Tests', container: testsHeader, container: testsHeader });

    // Tests body
    let testsBody = createElement({ className: 'tests-body', container: this.container });
    this.searchTests = createElement({ tagName: 'input', placeholder: 'Search tests', oninput: () => this.filterTests(), container: testsBody });
    this.testsElement = createElement({ className: 'tests', container: testsBody });

    // Results header
    let resultsHeader = createElement({ className: 'results-header', container: this.container });
    createElement({ tagName: 'h1', textContent: 'Test Results', container: resultsHeader, container: resultsHeader });
    this.unusedToggle = new Toggle('Hide Unused', 'Show Unused', () => this.filterResults(), { container: resultsHeader });
    this.warningToggle = new Toggle('Hide Warnings', 'Show Warnings', () => this.filterResults(), { container: resultsHeader });
    this.severeToggler = new Toggle('Hide Severe', 'Show Severe', () => this.filterResults(), { container: resultsHeader });
    this.errorToggler = new Toggle('Hide Errors', 'Show Errors', () => this.filterResults(), { container: resultsHeader });

    // Results body
    this.resultsBody = createElement({ className: 'results-body', container: this.container });

    // Viewer/Logger and MDL header
    let viewerLoggerMdlHeader = createElement({ className: 'viewer-and-mdl-header', container: this.container });
    let viewerLoggerMdlH1 = createElement({ tagName: 'h1', textContent: '3D View', container: viewerLoggerMdlHeader });

    // Viewer/Logger and MDL body
    let viewerLoggerMdlBody = createElement({ className: 'viewer-and-mdl-body', container: this.container });
    let viewerLogger = createElement({ className: 'viewer-and-console', container: viewerLoggerMdlBody });
    this.mdl = createElement({ className: 'mdl hidden', container: viewerLoggerMdlBody });

    // Viewer/Logger and MDL toggler
    new Toggle('View in MDL', 'View in 3D', (e) => {
      if (e.clicked) {
        viewerLoggerMdlH1.textContent = 'MDL View';

        hideElement(viewerLogger);
        showElement(this.mdl);

        if (!this.viewer.controls.animationToggle.clicked) {
          this.viewer.controls.animationToggle.toggle();
        }
      } else {
        viewerLoggerMdlH1.textContent = '3D View';

        showElement(viewerLogger);

        // If the page was resized in MDL view, the camera thinks the size of the canvas is 1x1.
        // Need to resize now that the canvas is visible again and has a real size.
        this.viewer.orbitCamera.onResize();

        hideElement(this.mdl);
      }
    }, { container: viewerLoggerMdlHeader });

    // Actual Viewer and Logger
    this.logger = new Logger({ container: viewerLogger });
    this.viewer = new Viewer(this, { container: viewerLogger });

    // Append at the end to avoid re-renders.
    parentElement.appendChild(this.container);
  }

  filterTests() {
    let term = this.searchTests.value.toLowerCase();

    for (let test of this.tests) {
      if (test.name.toLowerCase().includes(term)) {
        test.meta.show();
      } else {
        test.meta.hide();
      }
    }
  }

  filterResults() {
    if (this.visibleTest && this.visibleTest.results) {
      this.visibleTest.results.filter(this.unusedToggle.clicked, this.warningToggle.clicked, this.severeToggler.clicked, this.errorToggler.clicked);
    }
  }

  // pathSolver is used for API tests.
  test(name, buffer, render, pathSolver) {
    this.logger.info(`Parsing ${name}`);

    let test;

    try {
      test = new Test(this, name, buffer, pathSolver);
    } catch (e) {
      this.logger.error(`An error occured before the test could finish: ${e.stack}`)
    }

    this.tests.push(test);

    this.testsElement.appendChild(test.meta.container);
    test.meta.container.scrollIntoView();

    if (test.results) {
      this.resultsBody.appendChild(test.results.container);
    }

    if (test.mdl) {
      this.mdl.appendChild(test.mdl.container);
    }

    this.viewer.load(test);

    if (render) {
      this.render(test);
    } else {
      test.hide();
    }
  }

  render(test) {
    if (test !== this.visibleTest) {
      if (this.visibleTest) {
        this.visibleTest.hide();
      }

      this.visibleTest = test;
      this.filterResults();

      test.show();

      this.viewer.render(test);
    }
  }

  loadMap(name, buffer) {
    this.logger.info(`Parsing ${name}`);

    let map = new War3Map();

    try {
      map.load(buffer);
    } catch (e) {
      this.logger.error(`Failed to parse ${name}: ${e}`);

      return;
    }

    let pathSolver = (src, params) => {
      let file = map.get(src);

      if (file) {
        return file.bytes();
      }

      return localOrHive(src, params);
    };

    let render = true;

    for (let importName of map.getImportNames()) {
      let ext = extname(importName);

      if (ext === '.mdx' || ext === '.mdl' || ext === '.blp' || ext === '.dds' || ext === '.tga') {
        let file = map.get(importName);

        if (file) {
          if (ext === '.mdx') {
            this.test(`${name}:${importName}`, file.arrayBuffer(), render, pathSolver);
          } else if (ext === '.mdl') {
            this.test(`${name}:${importName}`, file.text(), render, pathSolver);
          } else if (ext === '.blp' || ext === '.dds' || ext === '.tga') {
            this.test(`${name}:${importName}`, file.arrayBuffer(), render);
          }

          render = false;
        } else {
          this.logger.error(`The map says it imports ${importName} but it couldn't be found`);
        }
      }
    }
  }

  /**
   * Load a file, e.g. resulting from a Drag & Drop action.
   */
  async loadFile(file) {
    let name = file.name;
    let ext = extname(name);

    if (ext === '.mdx' || ext === '.mdl' || ext === '.blp' || ext === '.dds' || ext === '.tga' || ext === '.w3x' || ext === '.w3m') {
      this.logger.info(`Reading ${name}`);

      let buffer = await readFile(file, ext === '.mdl');

      if (ext === '.w3m' || ext === '.w3x') {
        this.loadMap(name, buffer);
      } else {
        this.test(name, buffer, true);
      }
    } else {
      this.logger.info(`${name} is not a supported file, skipping it`);
    }
  }

  /**
   * Load all of the entries from a data transfer, e.g. resulting from a Drag & Drop action.
   */
  async loadDataTransfer(dataTransfer) {
    let entries = await getAllFileEntries(dataTransfer);
    let names = [];
    let promises = [];

    // First start reading all of the relevant files.
    for (let entry of entries) {
      let name = entry.name;
      let ext = extname(name);

      if (ext === '.mdx' || ext === '.mdl' || ext === '.blp' || ext === '.dds' || ext === '.tga' || ext === '.w3x' || ext === '.w3m') {
        this.logger.info(`Reading ${name}`);

        names.push(name.toLowerCase());
        promises.push(readEntry(entry, ext === '.mdl'));
      } else {
        this.logger.info(`${name} is not a supported file, skipping it`);
      }
    }

    // Finish reading...
    let buffers = await Promise.all(promises);

    // Now map from names to buffers.
    let overrides = new Map();

    for (let i = 0, l = names.length; i < l; i++) {
      overrides.set(names[i], buffers[i]);
    }

    // Path solver to see if a resource that needs loading is one of the files in the data transfer.
    let pathSolver = (src, params) => {
      let override = overrides.get(basename(src).toLowerCase());

      if (override) {
        return override;
      } else {
        return localOrHive(src, params);
      }
    };

    let render = true;

    // Finally load the tests.
    for (let [name, buffer] of overrides.entries()) {
      if (name.endsWith('.w3m') || name.endsWith('.w3x')) {
        this.loadMap(name, buffer);
      } else {
        this.test(name, buffer, render, pathSolver);
      }

      render = false;
    }
  }

  /**
   * Used by the Hiveworkshop to test resources.
   * 
   * file=url&file=url2&override[path]=url3
   */
  loadAPI(api) {
    if (api !== '') {
      let files = [];
      let overrides = new Map();

      for (let param of api.slice(1).split('&')) {
        let [key, value] = param.split('=');

        if (value !== undefined) {
          // Test also overrides.
          files.push(value);

          if (key.startsWith('override')) {
            // Discord changes \ to / in urls, ignoring escaping, so escape manually.
            overrides.set(key.slice(9, -1).replace(/\//g, '\\'), value);
          }
        }
      }

      if (files.length) {
        let pathSolver = (src, params) => {
          let override = overrides.get(basename(src).toLowerCase());

          if (override) {
            return override;
          } else {
            return localOrHive(src, params);
          }
        };

        let render = true;

        for (let file of files) {
          fetch(file)
            .then(async (response) => {
              let buffer;

              if (file.endsWith('.mdl')) {
                buffer = await response.text();
              } else {
                buffer = await response.arrayBuffer();
              }

              this.test(file, buffer, render, pathSolver);

              render = false;
            });
        }
      }
    }
  }
}
