
class WeuConverter extends Component {
  constructor(parentElement) {
    super({ className: 'client' });

    this.stack = [this.container];
    this.triggerData = new ModelViewer.default.parsers.w3x.wtg.TriggerData();
    this.weTriggerData = new ModelViewer.default.parsers.w3x.wtg.TriggerData();
    this.ready = false;

    this.load();

    parentElement.appendChild(this.container);
  }

  async load() {
    this.text('Fetching files: "UI\\TriggerData.txt", "TriggerDataWEU.txt", "TriggerDataYDWE.txt"');
    this.text('Please wait...');

    let [blzResponse, weuResponse, ydweResponse] = await Promise.all([
      fetch(localOrHive('UI\\TriggerData.txt')),
      fetch('TriggerDataWEU.txt'),
      fetch('TriggerDataYDWE.txt'),
    ]);

    let [blzText, weuText, ydweText] = await Promise.all([
      blzResponse.text(),
      weuResponse.text(),
      ydweResponse.text(),
    ]);

    this.triggerData.addTriggerData(blzText); // WE trigger data
    this.triggerData.addTriggerData(weuText, true); // WEU trigger data
    this.triggerData.addTriggerData(ydweText, true); // YDWE trigger data

    this.weTriggerData.addTriggerData(blzText); // WE trigger data

    this.ready = true;

    this.text('Ready, drag and drop a TFT map (*.w3x) or campaign (*.w3n) anywhere on the page');
  }

  clear() {
    this.container.innerHTML = '';
  }

  indent() {
    this.stack.unshift(createElement({ className: 'indent', container: this.stack[0] }));
  }

  deindent() {
    this.stack.shift();
  }

  text(text) {
    createElement({ textContent: text, container: this.stack[0] });

    window.scrollTo(0, 10000000);
  }

  error(text) {
    createElement({ className: 'error', textContent: text, container: this.stack[0] });

    window.scrollTo(0, 10000000);
  }

  results(results) {
    this.stack[0].appendChild((new WeuResults(results)).container);

    window.scrollTo(0, 10000000);
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
    let results = ModelViewer.default.utils.convertWeu(map, this.triggerData, this.weTriggerData);

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
      if (fileName.substr(fileName.lastIndexOf('.')).toLowerCase() === '.w3x') {
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
      this.text(`Converted with a total of ${totalChanges} changes spread over ${changedMaps} maps`);
    } else {
      this.text('Found nothing to convert');
    }

    return { parser: campaign, changes: totalChanges };
  }

  convertFile(file) {
    if (this.ready && file) {
      let name = file.name;
      let ext = name.substr(name.lastIndexOf('.')).toLowerCase();
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

            window.scrollTo(0, 10000000);

            saveAs(new Blob([results.parser.save()], { type: 'application/octet-stream' }), name);
          }
        });

        reader.readAsArrayBuffer(file);
      } else {
        this.error(`${name} is not a TFT map/campaign`);
      }
    }
  }
}
