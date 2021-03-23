class Test {
  constructor(tester, name, buffer, pathSolver) {
    let ext = ModelViewer.default.common.path.extname(name);
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
      this.parser = new ModelViewer.default.parsers.mdlx.Model();
    } else if (isBlp) {
      this.parser = new ModelViewer.default.parsers.blp.Image();
    } else if (isDds) {
      this.parser = new ModelViewer.default.parsers.dds.Image();
    } else {
      this.parser = new ModelViewer.default.parsers.tga.Image();
    }

    try {
      this.parser.load(buffer);
    } catch (e) {
      this.parsingError = true;

      tester.logger.error(`Failed to parse ${name}, the test will attempt to run on whatever data loaded`);
    }

    if (isMdlx) {
      this.results = new TestResults(ModelViewer.default.utils.mdlx.sanityTest(this.parser));
      this.mdl = new MdlView(ModelViewer.default.utils.mdlx.mdlStructure(this.parser));
    } else if (isBlp) {
      this.results = new TestResults(ModelViewer.default.utils.blp.sanityTest(this.parser));
    }

    this.meta = new TestMeta(this.name, this.parsingError, this.results, { onclick: () => tester.render(this) });
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