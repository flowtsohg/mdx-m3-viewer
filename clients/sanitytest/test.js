import { extname } from "../../src/common/path";
import MdlxModel from '../../src/parsers/mdlx/model';
import { BlpImage } from '../../src/parsers/blp/image';
import { DdsImage } from '../../src/parsers/dds/image';
import TgaImage from '../../src/parsers/tga/image';
import TestResults from "./components/testresults";
import TestMeta from "./components/testmeta";
import MdlView from "./components/mdlview";
import mdlxSanityTest from '../../src/utils/mdlx/sanitytest/sanitytest';
import mdlStructure from '../../src/utils/mdlx/mdlstructure';
import blpSanityTest from '../../src/utils/blp/sanitytest';
import ddsSanityTest from '../../src/utils/dds/sanitytest';

export default class Test {
  constructor(tester, name, buffer, pathSolver) {
    let ext = extname(name);
    let isMdlx = ext === '.mdx' || ext === '.mdl';
    let isBlp = ext === '.blp';
    let isDds = ext === '.dds';

    this.name = name;
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

      tester.logger.error(`Failed to parse ${name}, the test will attempt to run on whatever data loaded`);
    }

    if (isMdlx) {
      this.results = new TestResults(mdlxSanityTest(this.parser));
      this.mdl = new MdlView(mdlStructure(this.parser));
    } else if (isBlp) {
      this.results = new TestResults(blpSanityTest(this.parser), this.getMipmaps(this.parser));
    } else if (isDds) {
      this.results = new TestResults(ddsSanityTest(this.parser));
    }

    this.meta = new TestMeta(this.name, this.parsingError, this.results, { onclick: () => tester.render(this) });
  }

  getMipmaps(image) {
    let mipmaps = [];

    for (let i = 0, l = image.mipmaps(); i < l; i++) {
      try {
        mipmaps.push(image.getMipmap(i));
      } catch (e) {
        mipmaps.push(e);
      }
    }

    return mipmaps;
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