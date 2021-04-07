
class WeuConverter extends Component {
  constructor(parentElement) {
    super({ className: 'client' });

    this.triggerData = new ModelViewer.default.parsers.w3x.wtg.TriggerData();
    this.weTriggerData = new ModelViewer.default.parsers.w3x.wtg.TriggerData();
    this.ready = false;

    this.metaElement = createElement({ className: 'meta', container: this.container });
    this.metaStack = [this.metaElement];
    this.visibleMeta = null;

    this.changesElement = createElement({ className: 'changes', container: this.container });
    this.visibleChanges = null;

    this.load();

    parentElement.appendChild(this.container);
  }

  async load() {
    this.text('Fetching files: "UI\\TriggerData.txt", "TriggerDataWEU.txt", "TriggerDataYDWE.txt", "TriggerDataCustom.txt", "Scripts\\common.j"');
    this.text('Please wait...');

    let [blzResponse, commonjResponse, weuResponse, ydweResponse, customResponse] = await Promise.all([
      fetch(localOrHive('UI\\TriggerData.txt')),
      fetch(localOrHive('Scripts\\common.j')),
      fetch('TriggerDataWEU.txt'),
      fetch('TriggerDataYDWE.txt'),
      fetch('TriggerDataCustom.txt'),
    ]);

    let [blzText, commonjText, weuText, ydweText, customText] = await Promise.all([
      blzResponse.text(),
      commonjResponse.text(),
      weuResponse.text(),
      ydweResponse.text(),
      customResponse.text(),
    ]);

    this.triggerData.addTriggerData(blzText); // WE trigger data
    this.triggerData.addJassFunctions(commonjText); // natives from common.j
    this.triggerData.addTriggerData(weuText, true); // WEU trigger data
    this.triggerData.addTriggerData(ydweText, true); // YDWE trigger data
    this.triggerData.addTriggerData(customText, true);

    this.weTriggerData.addTriggerData(blzText); // WE trigger data

    this.ready = true;

    this.text('Ready, drag and drop a TFT map (*.w3x) or campaign (*.w3n) anywhere on the page');
  }

  clear() {
    this.metaElement.innerHTML = '';
    this.changesElement.innerHTML = '';
  }

  indent() {
    this.metaStack.unshift(createElement({ className: 'indent', container: this.metaStack[0] }));
  }

  deindent() {
    this.metaStack.shift();
  }

  text(text) {
    createElement({ textContent: text, container: this.metaStack[0] });

    this.metaElement.scrollTo(0, 10000000);
  }

  error(text) {
    createElement({ className: 'error', textContent: text, container: this.metaStack[0] });

    this.metaElement.scrollTo(0, 10000000);
  }

  results(results) {
    this.metaStack[0].appendChild((new WeuMeta(this, results)).container);

    this.metaElement.scrollTo(0, 10000000);
  }

  showChanges(meta) {
    if (this.visibleMeta) {
      this.visibleMeta.changesToggle.toggle();
    }

    this.visibleMeta = meta;

    meta.changes.show();
  }

  hideChanges() {
    if (this.visibleMeta) {
      this.visibleMeta.changes.hide();

      this.visibleMeta = null;
    }
  }

  convertMap(name, buffer) {
    this.text(`Parsing ${name}`);

    let map = new ModelViewer.default.parsers.w3x.Map();

    try {
      map.load(buffer);
    } catch (e) {
      this.error(`Failed to parse: ${e}`);
      this.error('This map is most likely protected/optimized');

      return;
    }

    let changesCount = 0;
    let results = ModelViewer.default.utils.w3x.convertWeu(map, this.triggerData, this.weTriggerData);

    this.indent();

    if (results.ok) {
      let changes = results.changes;

      if (changes.length) {
        changesCount = changes.length;

        this.results(results);
      } else {
        this.text('Found nothing to convert');
      }
    } else {
      this.error(results.error);
    }

    this.deindent();

    return { parser: map, changes: changesCount };
  }

  async convertCampaign(name, buffer) {
    this.text(`Parsing ${name}`);

    let campaign = new ModelViewer.default.parsers.mpq.Archive();

    try {
      campaign.load(buffer);
    } catch (e) {
      this.error(`Failed to parse: ${e}`);
      this.error('This campaign is most likely protected/optimized');

      return;
    }

    this.text('Looking for maps');

    let totalChanges = 0;
    let changedMaps = 0;

    for (let fileName of campaign.getFileNames()) {
      if (ModelViewer.default.common.path.extname(fileName) === '.w3x') {
        this.indent();

        let results = this.convertMap(fileName, campaign.get(fileName).arrayBuffer());

        this.deindent();

        if (results) {
          totalChanges += results.changes;
          changedMaps += 1;

          campaign.set(fileName, results.parser.save());
        }

        await aFrame();
      }
    }

    if (totalChanges) {
      this.text(`Converted with ${totalChanges} changes in ${changedMaps} maps`);
    } else {
      this.text('Found nothing to convert');
    }

    return { parser: campaign, changes: totalChanges };
  }

  convertFile(file) {
    if (this.ready && file) {
      let name = file.name;
      let ext = ModelViewer.default.common.path.extname(name);
      let isMap = ext === '.w3x';
      let isCampaign = ext === '.w3n';

      this.clear();

      if (isMap || isCampaign) {
        this.text(`Reading ${name}`);

        let reader = new FileReader();

        reader.addEventListener('loadend', async (e) => {
          let buffer = e.target.result;
          let results;

          this.indent();

          if (isMap) {
            results = this.convertMap(name, buffer);
          } else {
            results = await this.convertCampaign(name, buffer);
          }

          this.deindent();

          if (results && results.changes) {
            name = `${name.slice(0, -4)}_no_weu${ext}`;

            this.text(`Saving as ${name}`);

            this.metaElement.scrollTo(0, 10000000);

            saveAs(new Blob([results.parser.save().buffer], { type: 'application/octet-stream' }), name);
          }
        });

        reader.readAsArrayBuffer(file);
      } else {
        this.error(`${name} is not a TFT map/campaign`);
      }
    }
  }
}
