class Rebuilder extends Component {
  constructor(parentElement) {
    super();

    this.commonjText = '';
    this.blizzardjText = '';
    this.ready = false;

    this.load();

    parentElement.appendChild(this.container);
  }

  async load() {
    this.text('Fetching files: "Scripts\\common.j", "Scripts\\Blizzard.j"');
    this.text('Please wait...');

    let [commonjResponse, blizzardjResponse] = await Promise.all([
      fetch(localOrHive('Scripts\\common.j')),
      fetch(localOrHive('Scripts\\Blizzard.j')),
    ]);

    let [commonjText, blizzardjText] = await Promise.all([
      commonjResponse.text(),
      blizzardjResponse.text(),
    ]);

    this.commonjText = commonjText;
    this.blizzardjText = blizzardjText;

    this.text('Ready, drag and drop a map (*.w3m, *.w3x) anywhere on the page.');
  }

  clear() {
    this.container.innerHTML = '';
  }

  text(text) {
    createElement({ textContent: text, container: this.container });
  }

  rebuildFile(file) {
    if (file) {
      let name = file.name;
      let ext = ModelViewer.default.common.path.extname(name);
      let isMap = ext === '.w3m' || ext === '.w3x';

      this.clear();

      if (isMap) {
        this.text(`Reading ${name}`);

        let reader = new FileReader();

        reader.addEventListener('loadend', async (e) => {
          let buffer = e.target.result;

          this.text(`Parsing ${name}`);

          let map = new ModelViewer.default.parsers.w3x.Map();

          try {
            map.load(buffer);
          } catch (e) {
            this.text(`Failed to parse: ${e}`);

            return;
          }

          let context = new ModelViewer.default.utils.jass2.Context();

          this.text('Converting and running common.j');
          await aFrame();
          context.run(this.commonjText, true);

          this.text('Converting and running Blizzard.j');
          await aFrame();
          context.run(this.blizzardjText, true);

          this.text('Converting and running war3map.j');
          await aFrame();
          context.open(map);

          this.text('Running config()');
          await aFrame();
          context.call('config');

          this.text('Running main()');
          await aFrame();
          context.call('main');

          this.text('Collecting handles');
          await aFrame();

          let unitsFile = new ModelViewer.default.parsers.w3x.unitsdoo.File();
          let units = unitsFile.units;

          for (let handle of context.handles) {
            if (handle instanceof ModelViewer.default.utils.jass2.types.JassUnit) {
              let unit = new ModelViewer.default.parsers.w3x.unitsdoo.Unit();

              unit.id = handle.unitId;

              unit.location[0] = handle.x;
              unit.location[1] = handle.y;
              // For z need the height of the terrain!

              unit.angle = handle.face / 180 * Math.PI;

              unit.player = handle.player.index;

              unit.targetAcquisition = handle.acquireRange;

              units.push(unit);
            }
          }

          this.text(`Saving war3mapUnits.doo with ${units.length} objects`);
          await aFrame();
          map.set('war3mapUnits.doo', unitsFile.save(false));

          this.text('Finished');

          saveAs(new Blob([map.get('war3mapUnits.doo').arrayBuffer()], { type: 'application/octet-stream' }), 'war3mapUnits.doo');
        });

        reader.readAsArrayBuffer(file);
      } else {
        this.text(`${name} is not a map`);
      }
    }
  }
}
