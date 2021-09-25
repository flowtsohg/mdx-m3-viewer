import { basename, extname } from "../../src/common/path";
import MdlxModel from '../../src/parsers/mdlx/model';
import { BlpImage } from '../../src/parsers/blp/image';
import { DdsImage } from '../../src/parsers/dds/image';
import TgaImage from '../../src/parsers/tga/image';
import TestResults from "./components/testresults";
import TestMeta from "./components/testmeta";
import MdlView from "./components/mdlview";

export default class Test {
  constructor(tester, name, buffer, pathSolver) {
    let ext = extname(name);
    let isMdlx = ext === '.mdx' || ext === '.mdl';
    let isBlp = ext === '.blp';
    let isDds = ext === '.dds';

    this.name = name;
    this.shortName = basename(name);
    this.parsingError = false;
    this.results = null;
    this.mdl = null;
    this.pathSolver = pathSolver;

    // Loaded and set by the viewer component.
    this.resource = null;
    this.instance = null;
    this.boundingBox = null;
    this.boundingSphere = null;
    // this.cameras = [];

    if (isMdlx) {
      this.parser = new MdlxModel();
    } else if (isBlp) {
      this.parser = new BlpImage();
    } else if (isDds) {
      this.parser = new DdsImage();
    } else {
      this.parser = new TgaImage();
    }

    try {
      this.parser.load(buffer);
    } catch (e) {
      this.parsingError = true;

      tester.logger.error(`Failed to parse ${name}: ${e}. The test will attempt to run on whatever data loaded`);
    }

    this.results = new TestResults(this.parser);

    if (isMdlx) {
      this.mdl = new MdlView(this.parser);
    }

    this.meta = new TestMeta(this.shortName, this.parsingError, this.results.results, { onclick: () => tester.render(this) });
  }

  show() {
    this.meta.highlight();

    if (this.results) {
      this.results.show();
    }

    if (this.mdl) {
      this.mdl.show();
    }
  }

  hide() {
    this.meta.normal();

    if (this.results) {
      this.results.hide();
    }

    if (this.mdl) {
      this.mdl.hide();
    }
  }
}